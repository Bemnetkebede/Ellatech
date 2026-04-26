import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../src/store/AppContext';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { AlertModal } from '../../src/components/ui/AlertModal';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ProductDetailScreen() {
  const { sku } = useLocalSearchParams<{ sku: string }>();
  const { products, getTransactionHistory, adjustStock } = useAppStore();
  const router = useRouter();

  const product = products.find((p) => p.sku === sku);

  // Pagination State
  const [page, setPage] = useState(1);
  const LIMIT = 5;

  const history = getTransactionHistory(sku, page, LIMIT);
  
  const lastUpdated = history.total > 0 && history.data.length > 0
    ? new Date(history.data[0].timestamp).toLocaleString() 
    : 'Never updated';

  const [adjustAmount, setAdjustAmount] = useState('');
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successInfo, setSuccessInfo] = useState({ amount: 0, type: '' });

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500 text-lg">Product not found.</Text>
        <Button label="Go Back" className="mt-4 w-40" onPress={() => router.back()} />
      </View>
    );
  }

  const handleAdjust = (type: 'added' | 'removed') => {
    const amountNum = parseInt(adjustAmount, 10);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount greater than zero.');
      return;
    }

    if (type === 'removed' && amountNum > product.stockQuantity) {
      setModalContent({
        title: 'Insufficient Stock',
        message: `You cannot remove ${amountNum} units. Current stock is only ${product.stockQuantity} units.`
      });
      setModalVisible(true);
      return;
    }

    try {
      adjustStock(product.sku, amountNum, type);
      setAdjustAmount('');
      setError('');
      setPage(1); // Reset to page 1 to see the new transaction
      setSuccessInfo({ amount: amountNum, type });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to adjust stock.');
    }
  };

  const renderTransaction = ({ item }: { item: any }) => (
    <View className="bg-white p-4 rounded-xl mb-3 shadow-sm border border-gray-100 flex-row justify-between items-center">
      <View className="flex-1">
        <Text className="text-gray-800 font-bold text-sm mb-1">{item.id}</Text>
        <Text className="text-gray-400 text-xs">{new Date(item.timestamp).toLocaleString()}</Text>
      </View>
      <View className={`px-4 py-2 rounded-xl ${item.type === 'added' ? 'bg-green-100' : 'bg-red-100'}`}>
        <Text className={`font-bold ${item.type === 'added' ? 'text-green-700' : 'text-red-700'}`}>
          {item.type === 'added' ? '+' : '-'}{item.amount}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#1a3f75]">
      {/* Background Image */}
      <View className="absolute top-0 left-0 right-0 h-[40%]">
        <Image 
          source={require('../../assets/registration_bg.png')} 
          className="w-full h-full opacity-60"
          resizeMode="cover"
        />
      </View>

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          {/* Custom Header Area */}
          <View className="px-6 pt-6 pb-8 flex-row items-center">
            <TouchableOpacity 
              onPress={() => router.back()} 
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-4"
            >
              <Text className="text-white font-bold text-lg">←</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-white flex-1" numberOfLines={1}>
              {product.name}
            </Text>
          </View>

          {/* White Card Overlay */}
          <View className="flex-1 bg-gray-50 rounded-t-[40px] shadow-lg overflow-hidden">
            <FlatList
              data={history.data}
              keyExtractor={(item) => item.id}
              renderItem={renderTransaction}
              contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <>
                  {/* Status Card */}
                  <View className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6 items-center">
                    <View className="w-24 h-24 bg-blue-50 rounded-2xl overflow-hidden mb-4 items-center justify-center">
                      <Text className="text-[#1a3f75] text-4xl font-bold opacity-50">
                        {product.name.charAt(0)}
                      </Text>
                    </View>
                    <Text className="text-2xl font-bold text-gray-800 text-center mb-1">{product.name}</Text>
                    <Text className="text-gray-500 text-base mb-6">SKU: {product.sku}</Text>
                    
                    <View className="flex-row justify-between w-full border-t border-gray-100 pt-4">
                      <View className="items-center flex-1 border-r border-gray-100">
                        <Text className="text-gray-400 text-xs uppercase mb-1">Current Stock</Text>
                        <Text className={`text-3xl font-bold ${product.stockQuantity > 0 ? 'text-[#1a3f75]' : 'text-red-500'}`}>
                          {product.stockQuantity}
                        </Text>
                      </View>
                      <View className="items-center flex-1 pl-2">
                        <Text className="text-gray-400 text-xs uppercase mb-1">Price</Text>
                        <Text className="text-2xl font-bold text-gray-800">
                          ${product.price.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-xs text-gray-400 mt-4 text-center">Last Updated: {lastUpdated}</Text>
                  </View>

                  {/* Adjustment Controls */}
                  <Text className="text-lg font-bold text-gray-800 mb-4">Adjust Stock</Text>
                  <View className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
                    <Input
                      label="Quantity to Adjust"
                      placeholder="0"
                      value={adjustAmount}
                      onChangeText={(text) => {
                        setError('');
                        setAdjustAmount(text);
                      }}
                      keyboardType="number-pad"
                    />

                    {error ? (
                      <Text className="text-red-500 text-sm text-center mb-4">{error}</Text>
                    ) : null}

                    <View className="flex-row justify-between mt-2">
                      <Button 
                        label="- Remove" 
                        variant="outline"
                        className="flex-1 mr-2 border-red-200" 
                        onPress={() => handleAdjust('removed')} 
                      />
                      <Button 
                        label="+ Add" 
                        className="flex-1 ml-2" 
                        onPress={() => handleAdjust('added')} 
                      />
                    </View>
                  </View>

                  <Text className="text-lg font-bold text-gray-800 mb-4">Transaction History</Text>
                  {history.total === 0 && (
                     <Text className="text-gray-500 text-center py-4">No transactions recorded yet.</Text>
                  )}
                </>
              }
              ListFooterComponent={
                history.total > 0 ? (
                  <View className="flex-row justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <Button 
                      label="Previous" 
                      variant="outline"
                      className="w-28 h-12"
                      disabled={page === 1}
                      onPress={() => setPage((p) => Math.max(1, p - 1))}
                    />
                    <Text className="text-gray-500">
                      Page {history.page} of {history.totalPages}
                    </Text>
                    <Button 
                      label="Next" 
                      variant="outline"
                      className="w-28 h-12"
                      disabled={page >= history.totalPages}
                      onPress={() => setPage((p) => Math.min(history.totalPages, p + 1))}
                    />
                  </View>
                ) : null
              }
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <AlertModal 
        visible={modalVisible}
        title={modalContent.title}
        message={modalContent.message}
        onClose={() => setModalVisible(false)}
      />
      
      {/* Success Overlay */}
      {showSuccess && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.9)', zIndex: 1000, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 40, borderRadius: 40, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 }}>
            <View style={{ marginBottom: 20 }}>
              <Ionicons name="checkmark-circle" size={80} color="#1a3f75" />
            </View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1a3f75', marginBottom: 8 }}>Stock Updated!</Text>
            <Text style={{ color: '#6b7280', fontSize: 16, textAlign: 'center' }}>
              Successfully {successInfo.type} {successInfo.amount} units
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
