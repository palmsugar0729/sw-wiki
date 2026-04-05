<template>
    <div class="content" v-if="country">
      <h1>{{ country.countryChineseName }}</h1>
      <img :src="country.images" />
  
      <p>{{ country.shortContents }}</p>
  
      <h3 v-if="country.territory">领土</h3>
      <p>{{ country.territory }}</p>
  
      <h3 v-if="country.history">历史</h3>
      <p>{{ country.history }}</p>
  
      <h3 v-if="country.polity">政体</h3>
      <p>{{ country.polity }}</p>
  
      <h3 v-if="country.military">军事</h3>
      <p>{{ country.military }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRoute } from 'vue-router'
  import countries from '../data/countryInfo.json'
  
  const route = useRoute()
  const id = Number(route.params.id)
  
  const country = countries.find(c => c.id === id)
  </script>