<template>
  <div class="relative">
    <button
      class="w-full flex items-center justify-between px-4 py-2 bg-white rounded-full border-2 border-gray-200 hover:border-gray-300 focus:outline-none"
      @click="isOpen = !isOpen">
      <div class="flex items-center">
        <img v-if="modelValue === 'ETH'" src="../assets/tokens/ETH.svg" class="w-5 h-5 mr-2" alt="ETH" />
        <img v-if="modelValue === 'BTC'" src="../assets/tokens/BTC.svg" class="w-5 h-5 mr-2" alt="BTC" />
        <span class="font-medium">{{ modelValue || "Select" }}</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd" />
      </svg>
    </button>

    <div v-if="isOpen" class="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border-2 border-gray-200">
      <ul class="py-1">
        <li v-for="currency in currencies" :key="currency" @click="selectCurrency(currency)"
          class="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center">
          <img v-if="props.tokens.find((token) => token.name === currency)?.image"
            :src="props.tokens.find((token) => token.name === currency)?.image" class="w-5 h-5 mr-2" :alt="currency" />
          {{ currency }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  currencies: Array,
  modelValue: String,
  tokens: Array,
});

const emit = defineEmits(['update:modelValue']);
const isOpen = ref(false);

const selectCurrency = (currency) => {
  emit('update:modelValue', currency);
  isOpen.value = false;
};
</script>