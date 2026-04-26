import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../src/store/AppContext';
import { ProductCard } from '../src/components/domain/ProductCard';
import { Input } from '../src/components/ui/Input';
import { Button } from '../src/components/ui/Button';
import { ProfileModal } from '../src/components/ui/ProfileModal';
import { useRouter } from 'expo-router';

// Reusable selection modal for filters - Now an inline dropdown
const InlineDropdown = ({ visible, options, selected, onSelect, onClose, top }: any) => {
  if (!visible) return null;
  return (
    <View style={[styles.inlineDropdown, { top }]}>
      <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.dropdownOverlay} />
      <View style={styles.dropdownContent}>
        {options.map((opt: string) => (
          <TouchableOpacity key={opt} onPress={() => onSelect(opt)} style={styles.dropdownOption}>
            <Text style={[styles.dropdownOptionText, selected === opt && styles.dropdownOptionSelected]}>{opt}</Text>
            {selected === opt && <Ionicons name="checkmark-circle" size={16} color="#1a3f75" />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Separate components to isolate rendering and context
const UserRegistration = ({ onRegister }: { onRegister: (name: string, email: string) => void }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!fullName.trim() || !email.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    onRegister(fullName, email);
  };

  return (
    <View style={styles.regContainer}>
      <View style={styles.regBgImage}>
        <Image source={require('../assets/registration_bg.png')} style={styles.fullImage} resizeMode="cover" />
      </View>
      <SafeAreaView style={styles.flex1}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex1}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.flex1} showsVerticalScrollIndicator={false}>
            <View style={styles.regHeader}>
              <View style={styles.regLogo}>
                <Ionicons name="cube" size={24} color="white" />
              </View>
              <Text style={styles.regTitle}>Ellatech</Text>
              <Text style={styles.regSubtitle}>Inventory management made simple.</Text>
            </View>

            <View style={styles.regCard}>
              <Text style={styles.regCardTitle}>Register</Text>
              <Text style={styles.regCardSubtitle}>Create your account to continue</Text>
              <View style={{ gap: 12 }}>
                <Input label="Full Name" placeholder="Enter your name" value={fullName} onChangeText={(t) => { setError(''); setFullName(t); }} />
                <Input label="Email Address" placeholder="name@company.com" value={email} onChangeText={(t) => { setError(''); setEmail(t); }} keyboardType="email-address" autoCapitalize="none" />
              </View>
              {error ? <Text style={styles.regError}>{error}</Text> : null}
              <Button label="Create Account" onPress={handleSubmit} style={styles.regBtn} />
              <View style={styles.socialSection}>
                <Text style={styles.socialText}>Or continue with</Text>
                <View style={styles.socialRow}>
                  <TouchableOpacity style={styles.socialBtn}><Ionicons name="logo-google" size={28} color="#EA4335" /></TouchableOpacity>
                  <TouchableOpacity style={styles.socialBtn}><Ionicons name="logo-apple" size={28} color="black" /></TouchableOpacity>
                  <TouchableOpacity style={styles.socialBtn}><Ionicons name="logo-facebook" size={28} color="#1877F2" /></TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const DashboardContent = () => {
  const { user, products, registerProduct, getTransactionHistory, logout } = useAppStore();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'products' | 'history'>('products');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [historyPage, setHistoryPage] = useState(1);
  const [showProfile, setShowProfile] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'In Stock' | 'Out of Stock'>('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [productError, setProductError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredProducts = useMemo(() => products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || (selectedStatus === 'In Stock' ? p.stockQuantity > 0 : p.stockQuantity === 0);
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  }), [products, searchQuery, selectedStatus, selectedCategory]);

  const globalHistory = useMemo(() => getTransactionHistory(undefined, historyPage, 10), [getTransactionHistory, historyPage]);
  const recentActivity = useMemo(() => getTransactionHistory(undefined, 1, 5), [getTransactionHistory]);

  const handleSaveProduct = () => {
    if (!sku.trim() || !name.trim() || !price.trim() || !quantity.trim()) {
      setProductError('Please fill in all fields.');
      return;
    }
    try {
      registerProduct({ sku: sku.trim().toUpperCase(), name: name.trim(), price: parseFloat(price), initialStock: parseInt(quantity, 10), category: category.trim() || 'General' });
      setSku(''); setName(''); setPrice(''); setQuantity(''); setCategory(''); setProductError('');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setShowAddProduct(false);
      }, 2000);
    } catch (err: any) { setProductError(err.message); }
  };

  return (
    <View style={styles.dashContainer}>
      <View style={styles.dashBgImage}>
        <Image source={require('../assets/registration_bg.png')} style={styles.fullImage} resizeMode="cover" />
      </View>
      <SafeAreaView style={styles.flex1}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex1}>
          <View style={styles.dashHeader}>
            <View style={styles.dashHeaderIcons}>
              <TouchableOpacity style={styles.notifBtn}><Ionicons name="notifications-outline" size={20} color="white" /></TouchableOpacity>
              <TouchableOpacity onPress={() => setShowProfile(true)} style={styles.profileBtn}><Text style={styles.profileText}>{user?.name[0]}</Text></TouchableOpacity>
            </View>
            <Text style={styles.dashTitle}>{activeTab === 'products' ? 'Products' : 'History'}</Text>
          </View>
          <View style={styles.whiteOverlay}>
            <View style={styles.tabContainer}>
              <TouchableOpacity onPress={() => setActiveTab('products')} style={[styles.tab, activeTab === 'products' && styles.tabActive]}><Text style={[styles.tabText, activeTab === 'products' && styles.tabTextActive]}>Items</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTab('history')} style={[styles.tab, activeTab === 'history' && styles.tabActive]}><Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>History</Text></TouchableOpacity>
            </View>
            {activeTab === 'products' ? (
              <FlatList data={showAddProduct ? [] : filteredProducts} keyExtractor={(item) => item.sku} showsVerticalScrollIndicator={false}
                ListHeaderComponent={<>
                    {!showAddProduct ? (
                      <>
                        <View style={styles.searchBar}><Ionicons name="search-outline" size={20} color="#9ca3af" /><TextInput placeholder="Search products..." style={styles.searchInput} value={searchQuery} onChangeText={setSearchQuery} /></View>
                        <View style={{ flexDirection: 'row', marginBottom: 12, gap: 8, zIndex: 10 }}>
                          <View style={{ flex: 1 }}>
                            <TouchableOpacity 
                              onPress={() => setShowStatusModal(!showStatusModal)}
                              style={styles.filterChip}
                            >
                              <Text style={styles.filterLabel}>Status:</Text>
                              <Text style={styles.filterValue}>{selectedStatus}</Text>
                              <Ionicons name="chevron-down-outline" size={14} color="#374151" />
                            </TouchableOpacity>
                            <InlineDropdown 
                              visible={showStatusModal} 
                              options={['All', 'In Stock', 'Out of Stock']} 
                              selected={selectedStatus} 
                              onSelect={(val: any) => { setSelectedStatus(val); setShowStatusModal(false); }} 
                              onClose={() => setShowStatusModal(false)}
                              top={35}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <TouchableOpacity 
                              onPress={() => setShowCategoryModal(!showCategoryModal)}
                              style={styles.filterChip}
                            >
                              <Text style={styles.filterLabel}>Category:</Text>
                              <Text style={styles.filterValue}>{selectedCategory}</Text>
                              <Ionicons name="chevron-down-outline" size={14} color="#374151" />
                            </TouchableOpacity>
                            <InlineDropdown 
                              visible={showCategoryModal} 
                              options={['All', ...new Set(products.map(p => p.category || 'General'))]} 
                              selected={selectedCategory} 
                              onSelect={(val: any) => { setSelectedCategory(val); setShowCategoryModal(false); }} 
                              onClose={() => setShowCategoryModal(false)}
                              top={35}
                            />
                          </View>
                        </View>
                        <View style={styles.statCard}><View><Text style={styles.statLabel}>TOTAL ITEMS</Text><Text style={styles.statValue}>{products.length}</Text></View><Button label="+ Add Item" variant="primary" style={styles.addBtn} onPress={() => setShowAddProduct(true)} /></View>
                      </>
                    ) : (
                      <View style={styles.formCard}>
                        {showSuccess ? (
                          <View style={styles.successView}>
                            <View style={{ marginBottom: 16 }}>
                              <Ionicons name="checkmark-circle" size={80} color="#1a3f75" />
                            </View>
                            <Text style={styles.successTitle}>Product Added!</Text>
                            <Text style={styles.successSubtitle}>Your inventory has been updated.</Text>
                          </View>
                        ) : (
                          <>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1a3f75', marginBottom: 16 }}>Add New Product</Text>
                            <Input label="SKU" value={sku} onChangeText={setSku} placeholder="SKU-001" />
                            <Input label="Name" value={name} onChangeText={setName} placeholder="Name" />
                            <Input label="Category" value={category} onChangeText={setCategory} placeholder="Category" />
                            <Input label="Price" value={price} onChangeText={setPrice} placeholder="0.00" keyboardType="decimal-pad" />
                            <Input label="Quantity" value={quantity} onChangeText={setQuantity} placeholder="0" keyboardType="number-pad" />
                            {productError ? <Text style={styles.formError}>{productError}</Text> : null}
                            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                              <Button label="Cancel" variant="outline" style={{ flex: 1 }} onPress={() => setShowAddProduct(false)} />
                              <Button label="Save" style={{ flex: 1 }} onPress={handleSaveProduct} />
                            </View>
                          </>
                        )}
                      </View>
                    )}
                </>}
                renderItem={({ item }) => (<ProductCard product={item} onPress={() => router.push(`/product/${item.sku}`)} />)}
                ListFooterComponent={<View style={{ height: 40 }} />}
              />
            ) : (
              <FlatList data={globalHistory.data} keyExtractor={(item) => item.id} showsVerticalScrollIndicator={false}
                ListEmptyComponent={<View style={styles.emptyContainer}><Ionicons name="time-outline" size={48} color="#d1d5db" /><Text style={styles.emptyHistoryText}>No transactions yet.</Text></View>}
                renderItem={({ item }) => (<View style={styles.activityItem}><View><Text style={styles.activityName}>{products.find(p => p.sku === item.productSku)?.name || 'Item'}</Text><Text style={styles.activityTime}>{new Date(item.timestamp).toLocaleString()}</Text></View><Text style={[styles.activityAmount, { color: item.type === 'added' ? '#10b981' : '#ef4444' }]}>{item.type === 'added' ? '+' : '-'}{item.amount}</Text></View>)}
                ListFooterComponent={globalHistory.total > 0 ? (<View style={styles.pagination}><Button label="Prev" variant="outline" style={styles.pagBtn} disabled={historyPage === 1} onPress={() => setHistoryPage(p => p - 1)} /><Text>Page {historyPage}</Text><Button label="Next" variant="outline" style={styles.pagBtn} disabled={historyPage >= globalHistory.totalPages} onPress={() => setHistoryPage(p => p + 1)} /></View>) : null}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      {user && <ProfileModal visible={showProfile} user={user} onLogout={logout} onClose={() => setShowProfile(false)} />}
    </View>
  );
};

export default function DashboardScreen() {
  const { user, registerUser } = useAppStore();
  if (!user) return <UserRegistration onRegister={registerUser} />;
  return <DashboardContent />;
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  fullImage: { width: '100%', height: '100%' },
  // Registration Styles
  regContainer: { flex: 1, backgroundColor: '#1a3f75' },
  regBgImage: { position: 'absolute', top: 0, left: 0, right: 0, height: '40%' },
  regHeader: { paddingTop: 64, paddingBottom: 24, alignItems: 'center', paddingHorizontal: 24 },
  regLogo: { width: 48, height: 48, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  regTitle: { fontSize: 32, fontWeight: '900', color: 'white', letterSpacing: -1, marginBottom: 4 },
  regSubtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: '500', textAlign: 'center' },
  regCard: { flex: 1, backgroundColor: 'white', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 },
  regCardTitle: { fontSize: 28, fontWeight: '900', color: '#1a3f75', marginBottom: 4 },
  regCardSubtitle: { color: '#9ca3af', marginBottom: 32, fontWeight: '500' },
  regError: { color: '#ef4444', fontSize: 12, fontWeight: '700', textAlign: 'center', marginTop: 16 },
  regBtn: { mt: 32, height: 64, borderRadius: 24 },
  socialSection: { marginTop: 40, paddingBottom: 40, alignItems: 'center' },
  socialText: { color: '#d1d5db', fontWeight: 'bold', fontSize: 10, letterSpacing: 1.5, marginBottom: 24, textTransform: 'uppercase' },
  socialRow: { flexDirection: 'row', gap: 32 },
  socialBtn: { width: 64, height: 64, borderRadius: 20, backgroundColor: '#f9fafb', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#f3f4f6' },
  // Dashboard Styles
  dashContainer: { flex: 1, backgroundColor: '#1a3f75' },
  dashBgImage: { position: 'absolute', width: '100%', height: '22%', opacity: 0.4 },
  dashHeader: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 16, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  dashTitle: { fontSize: 32, fontWeight: 'bold', color: 'white' },
  dashHeaderIcons: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notifBtn: { width: 34, height: 34, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  profileBtn: { width: 34, height: 34, backgroundColor: 'white', borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  profileText: { color: '#1a3f75', fontWeight: 'bold', fontSize: 12 },
  whiteOverlay: { flex: 1, backgroundColor: '#f9fafb', borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingHorizontal: 20, paddingTop: 32, overflow: 'hidden' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#e5e7eb', padding: 4, borderRadius: 16, marginBottom: 12 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 12, alignItems: 'center' },
  tabActive: { backgroundColor: 'white' },
  tabText: { fontWeight: 'bold', color: '#6b7280', fontSize: 13 },
  tabTextActive: { color: '#1a3f75' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', height: 40, borderRadius: 12, paddingHorizontal: 16, marginBottom: 10, borderWidth: 1, borderColor: '#f3f4f6' },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 13 },
  filterRow: { flexDirection: 'row', marginBottom: 12, gap: 8 },
  filterChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1, borderColor: '#f3f4f6' },
  filterLabel: { color: '#9ca3af', fontSize: 10, fontWeight: 'bold', marginRight: 4, textTransform: 'uppercase' },
  filterValue: { color: '#374151', fontWeight: 'bold', marginRight: 4 },
  statCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#f3f4f6', marginBottom: 24 },
  statLabel: { color: '#9ca3af', fontSize: 12, fontWeight: 'bold' },
  statValue: { fontSize: 28, fontWeight: '900', color: '#1a3f75' },
  addBtn: { width: 100, height: 44 },
  formCard: { backgroundColor: 'white', padding: 20, borderRadius: 24, marginBottom: 24, borderWidth: 1, borderColor: '#f3f4f6' },
  formError: { color: 'red', marginBottom: 10 },
  recentSection: { marginTop: 24, marginBottom: 40 },
  recentTitle: { fontSize: 18, fontWeight: 'bold', color: '#374151', marginBottom: 16 },
  activityItem: { backgroundColor: 'white', padding: 16, borderRadius: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  activityName: { fontWeight: 'bold' },
  activityTime: { fontSize: 10, color: '#9ca3af' },
  activityAmount: { fontWeight: 'bold' },
  emptyRecent: { marginTop: 24, marginBottom: 40, alignItems: 'center' },
  emptyText: { color: '#9ca3af', fontStyle: 'italic' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  emptyHistoryText: { fontSize: 18, color: '#9ca3af', fontWeight: 'bold', marginTop: 16 },
  pagination: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingBottom: 40, alignItems: 'center' },
  pagBtn: { width: 80 },
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 32 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a3f75', marginBottom: 24 },
  modalOption: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalOptionText: { fontSize: 16, color: '#374151' },
  modalOptionSelected: { fontWeight: 'bold', color: '#1a3f75' },
  modalCancel: { marginTop: 24, paddingVertical: 16, backgroundColor: '#f9fafb', borderRadius: 16, alignItems: 'center' },
  modalCancelText: { fontWeight: 'bold', color: '#6b7280' },
  // Inline Dropdown Styles
  inlineDropdown: { position: 'absolute', left: 0, right: 0, zIndex: 1000 },
  dropdownOverlay: { position: 'fixed', top: -1000, left: -1000, right: -1000, bottom: -1000, backgroundColor: 'transparent' },
  dropdownContent: { backgroundColor: 'white', borderRadius: 12, padding: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, borderWidth: 1, borderColor: '#f3f4f6' },
  dropdownOption: { paddingVertical: 10, paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dropdownOptionText: { fontSize: 13, color: '#374151' },
  dropdownOptionSelected: { fontWeight: 'bold', color: '#1a3f75' },
  // Success View Styles
  successView: { alignItems: 'center', paddingVertical: 20 },
  successIconContainer: { marginBottom: 16 },
  successTitle: { fontSize: 22, fontWeight: 'bold', color: '#1a3f75', marginBottom: 8 },
  successSubtitle: { color: '#6b7280', textAlign: 'center' }
});
