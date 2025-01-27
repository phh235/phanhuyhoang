<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-xl bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
      <div class="flex gap-4 mb-6">
        <button class="text-lg font-medium text-gray-900 pb-2 border-b-2 border-gray-900">
          Swap
        </button>
      </div>

      <div class="space-y-4">
        <!-- From Currency -->
        <div class="p-4 bg-white rounded-2xl border-2 border-gray-100">
          <label class="block text-sm text-gray-600 mb-2">From</label>
          <div class="flex items-center justify-between">
            <input type="text" @input="validateAmount" v-model="amount"
              class="text-3xl font-medium focus:outline-none w-1/2" placeholder="0" />
            <CurrencyDropdown :tokens="tokens" :currencies="Object.keys(currencyPrices)" v-model="fromCurrency" />
          </div>
          <div class="text-sm text-gray-500 mt-2">
            Balance: {{ fromCurrency ? `${6531.53} ${fromCurrency}` : '0.00' }}
          </div>
        </div>

        <!-- Swap Icon -->
        <div class="flex justify-center">
          <button
            class="p-2 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-all hover:cursor-pointer"
            @click="swapCurrencies">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        <!-- To Currency -->
        <div class="p-4 bg-white rounded-2xl border-2 border-gray-100">
          <label class="block text-sm text-gray-600 mb-2">To</label>
          <div class="flex items-center justify-between">
            <input type="text" @input="validateAmount" :value="calculatedAmount"
              class="text-3xl font-medium focus:outline-none w-1/2" readonly />
            <CurrencyDropdown :tokens="tokens" :currencies="Object.keys(currencyPrices)" v-model="toCurrency" />
          </div>
          <div class="text-sm text-gray-500 mt-2">
            Balance: {{ toCurrency ? `${2439.72} ${toCurrency}` : '0.00' }}
          </div>
        </div>

        <!-- Exchange Rate -->
        <div class="text-sm text-gray-500 px-2">
          1 {{ fromCurrency }} = 0.035 {{ toCurrency }} ($68,850.47)
        </div>

        <!-- Additional Info (shown after Preview) -->
        <div v-if="showDetails" class="space-y-3 mt-4">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Price</span>
            <span>1 {{ fromCurrency }} = 0.035 {{ toCurrency }} ($68,850.47)</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Network Fees</span>
            <span>$3.50</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Price Impact</span>
            <span class="text-red-500">-0.15%</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Slippage Tolerance</span>
            <span>0.5%</span>
          </div>
          <div class="text-sm text-gray-500 mt-4">
            <span class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              You'll receive at least {{ calculatedAmount }} {{ toCurrency }} (~$90,611.85) or the transaction will be
              refunded.
            </span>
          </div>
        </div>

        <!-- Action Button -->
        <button @click="handleAction" :disabled="!isFormValid || isLoading"
          class="w-full py-4 px-6 text-white bg-orange-500 hover:bg-orange-600 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-4 transition-all hover:cursor-pointer">
          {{ showDetails ? 'Confirm Swap' : 'Preview Swap' }}
        </button>

        <div v-if="error" class="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import CurrencyDropdown from "./CurrencyDropdown.vue";

const tokens = ref([]);
const currencyPrices = ref({});
const fromCurrency = ref('ETH');
const toCurrency = ref('BTC');
const amount = ref(251);
const isLoading = ref(false);
const error = ref(null);
const showDetails = ref(false);

const fetchPrices = async () => {
  try {
    const { data } = await axios.get("https://interview.switcheo.com/prices.json");
    currencyPrices.value = Object.fromEntries(
      data.map(({ currency, price }) => [currency, price])
    );
    tokens.value = data.map(({ currency }) => ({
      name: currency,
      image: new URL(`../assets/tokens/${currency}.svg`, import.meta.url).href, // Load ảnh từ thư mục assets/token
    }));
  } catch (err) {
    error.value = "Failed to load currency prices. Please try again later.";
  }
};

const isFormValid = computed(() => {
  return fromCurrency.value && toCurrency.value && amount.value > 0;
});

const calculatedAmount = computed(() => {
  if (!amount.value || !fromCurrency.value || !toCurrency.value) return '';
  const fromPrice = currencyPrices.value[fromCurrency.value] || 0;
  const toPrice = currencyPrices.value[toCurrency.value] || 0;
  if (!fromPrice || !toPrice) return '';
  return ((amount.value * fromPrice) / toPrice).toFixed(2);
});

const swapCurrencies = () => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
};

const validateAmount = () => {
  // Remove any non-digit characters, allowing only positive numbers
  amount.value = amount.value.replace(/[^0-9.]/g, '');
};

const handleAction = async () => {
  if (!isFormValid.value) return;

  if (!showDetails.value) {
    showDetails.value = true;
    return;
  }

  isLoading.value = true;
  error.value = null;

  // Simulate swap
  setTimeout(() => {
    showDetails.value = false;
    isLoading.value = false;
  }, 1500);
};

// Fetch prices on component mount
fetchPrices();
</script>