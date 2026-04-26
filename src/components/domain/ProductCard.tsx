import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onAdjustStock?: (sku: string, amount: number, type: 'added' | 'removed') => void;
}

export const ProductCard = ({ product, onPress, onAdjustStock }: ProductCardProps) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={onPress}
      className="bg-white rounded-3xl p-4 border border-gray-100 flex-row items-center mb-4"
    >
      <View className="w-20 h-20 bg-blue-50 rounded-2xl overflow-hidden mr-4 items-center justify-center">
        {product.imageUrl ? (
          <Image 
            source={{ uri: product.imageUrl }} 
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <Text className="text-[#2b4c8a] text-2xl font-bold opacity-50">
            {product.name.charAt(0)}
          </Text>
        )}
      </View>
      
      <View className="flex-1">
        <Text className="text-lg font-bold text-gray-800 mb-1" numberOfLines={1}>
          {product.name}
        </Text>
        <Text className="text-gray-500 text-sm mb-2" numberOfLines={1}>
          SKU: {product.sku}
        </Text>
        <View className="flex-row items-center justify-between mt-auto">
          <Text className="text-[#1a3f75] font-bold text-lg">
            ${product.price.toFixed(2)}
          </Text>
          <View className={`px-3 py-1 rounded-full ${
            product.stockQuantity > 0 ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <Text className={`text-xs font-bold ${
              product.stockQuantity > 0 ? 'text-[#00C853]' : 'text-red-500'
            }`}>
              {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
