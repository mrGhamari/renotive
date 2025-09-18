<!-- pages/products.vue -->
<template>
  <section class="product-page">
    <div class="container">
      <div class="actions">
        <div class="sort"><ui-sort v-model="sortDir" /></div>
        <div class="search">
          <ui-input v-model="userSearch" placeholder="Search Product" />
        </div>
        <ui-button class="create" size="sm" variant="primary"
          >Create New Product</ui-button
        >
      </div>
    </div>

    <div class="container">
      <div class="grid12">
        <div class="grid12__item" v-for="p in items" :key="p.id">
          <ProductCard :product="p" />
        </div>
      </div>

      <div class="muted" style="margin-top: var(--sp-3)">
        <span v-if="initialLoading">Loading…</span>
        <span v-else-if="error">Failed to load.</span>
        <span v-else-if="isFetchingMore">Loading more…</span>
        <span v-else-if="!hasMore && items.length">No more results</span>
        <span v-else-if="!items.length">No results</span>
      </div>

      <div ref="infiniteEl" style="height: 1px"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { IProduct } from '~/types/product';
import ProductCard from '~/components/productCard.vue';
import { useInfiniteScroll, watchDebounced } from '@vueuse/core';

// ------ Type ------
type Resp = {
  page: number;
  total: number;
  pageSize: number;
  items: IProduct[];
};

// ------ Variables ------
const page = ref<number>(1);
const pageSize: number = 12;
const total = ref<number>(0);
const seenIds = new Set<number>();
const items = ref<IProduct[]>([]);
const userSearch = ref<string>('');
const reachedEnd = ref<boolean>(false);
const debouncedQ = ref(userSearch.value);
const sortDir = ref<'asc' | 'desc'>('asc');
const infiniteEl = ref<HTMLElement | null>(null);



// ------ Computed ------
const initialLoading = computed(() => pending.value && page.value === 1);
const isFetchingMore = computed(() => pending.value && page.value > 1);
const hasMore = computed(
  () =>
    !reachedEnd.value && (total.value === 0 || items.value.length < total.value)
);
const query = computed(() => ({
  q: debouncedQ.value,
  dir: sortDir.value,
  page: page.value,
  pageSize,
}));

// ------ API Calls ------
const { data, pending, error } = await useFetch<Resp>('/api/products', {
  query,
  watch: [query],
  server: false,
  dedupe: 'defer',
});

// ------ Watchers ------
watchDebounced(
  userSearch,
  (v) => {
    debouncedQ.value = v;
    page.value = 1;
    items.value = [];
    total.value = 0;
    reachedEnd.value = false;
    seenIds.clear();
  },
  { debounce: 300, maxWait: 600 }
);

watch(sortDir, () => {
  page.value = 1;
  items.value = [];
  total.value = 0;
  reachedEnd.value = false;
  seenIds.clear();
});

watch(
  data,
  (val) => {
    if (!val) return;
    const chunk = val.items ?? [];
    total.value = typeof val.total === 'number' ? val.total : 0;
    const newOnes: IProduct[] = [];
    for (const p of chunk) {
      if (!seenIds.has(p.id)) {
        seenIds.add(p.id);
        newOnes.push(p);
      }
    }
    if (page.value === 1) items.value = newOnes;
    else items.value = [...items.value, ...newOnes];

    if (total.value > 0 && items.value.length >= total.value)
      reachedEnd.value = true;
    if (chunk.length < pageSize || newOnes.length === 0)
      reachedEnd.value = true;
  },
  { immediate: true }
);

// ------ LifeCycle ------
onMounted(() => {
  useInfiniteScroll(
    infiniteEl,
    () => {
      if (hasMore.value && !pending.value) page.value += 1;
    },
    {
      distance: 300,
      canLoadMore: () => hasMore.value && !pending.value,
    }
  );
});
</script>

<style scoped>
.product-page {
  padding-block: var(--sp-6);
}
.actions {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas: 'sort search create';
  align-items: end;
  gap: var(--sp-3);
}
.sort {
  grid-area: sort;
}
.search {
  grid-area: search;
  justify-self: center;
  width: min(560px, 100%);
}
.create {
  grid-area: create;
  justify-self: end;
}
@media (max-width: 768px) {
  .actions {
    grid-template-columns: 1fr;
    grid-template-areas: 'create' 'sort' 'search';
    row-gap: var(--sp-4);
  }
  .create,
  .search {
    justify-self: stretch;
    width: 100%;
  }
}
.grid12 {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--sp-4);
  margin-top: var(--sp-6);
}
.grid12__item {
  grid-column: span 12;
}
@media (min-width: 1024px) {
  .grid12__item {
    grid-column: span 4;
  }
}
.grid12__item > * {
  height: 100%;
}
.muted {
  color: var(--muted);
  font-size: var(--fs-0);
}
</style>
