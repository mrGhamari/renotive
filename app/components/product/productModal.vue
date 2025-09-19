
<script setup lang="ts">
import type { IProduct } from '~/types/product';

const props = defineProps<{ productId: number | null }>();
const open = defineModel<boolean>('open', { default: false });

const key = computed(() =>
  open.value && props.productId ? `/api/products/${props.productId}` : null
);
const {
  data: product,
  pending,
  error,
} = await useFetch<IProduct>(key, { server: false });

function close() {
  open.value = false;
}
</script>

<template>
  <UiModal v-model:open="open">
    <header class="pm__header">
      <h3 class="pm__title">Product Details</h3>
      <UiButton @click="close">Close</UiButton>
    </header>

    <div class="pm__body">
      <div v-if="pending" class="pm__state">Loading…</div>
      <div v-else-if="error" class="pm__state">Failed to load.</div>

      <div v-else-if="product" class="pmv">
        <img
          :src="product.thumbnail"
          :alt="product.title"
          loading="lazy"
          class="pmv__img"
        />
        <div class="pmv__head">
          <div>
            <h4 class="pmv__title">{{ product.title }}</h4>
            <p class="pmv__sub">{{ product.brand }} • {{ product.category }}</p>
          </div>
          <div class="pmv__price">$ {{ product.price.toFixed(2) }}</div>
        </div>

        <p class="pmv__desc">{{ product.description }}</p>

        <div class="pmv__meta">
          <span>★ {{ product.rating?.toFixed?.(1) ?? '—' }}</span>
          <span v-for="t in product.tags?.slice(0, 5)" :key="t" class="tag">{{
            t
          }}</span>
        </div>

        <div class="pmv__grid">
          <div>
            <strong>Stock</strong><span>{{ product.stock }}</span>
          </div>
          <div>
            <strong>SKU</strong><span>{{ product.sku }}</span>
          </div>
        </div>
      </div>

      <div v-else class="pm__state">Not found.</div>
    </div>
  </UiModal>
</template>

<style scoped>
.pm__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--br);
  padding-bottom: var(--sp-3);
}
.pm__title {
  margin: 0;
  font-size: var(--fs-2);
}
.pm__body {
  display: grid;
  gap: var(--sp-4);
}
.pm__state {
  color: var(--muted);
}
.pmv {
  display: grid;
  gap: var(--sp-3);
}
.pmv__img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: var(--radius-sm);
}
.pmv__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--sp-3);
}
.pmv__title {
  margin: 0;
  font-size: var(--fs-3);
}
.pmv__sub {
  margin: 0.25rem 0 0;
  color: var(--muted);
  font-size: var(--fs-0);
}
.pmv__price {
  font-weight: 800;
  font-size: var(--fs-3);
}
.pmv__desc {
  margin: 0;
  color: color-mix(in oklab, var(--fg) 70%, white 30%);
}
.pmv__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  align-items: center;
}
.pmv__grid {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.pmv__grid > div {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 0.5rem;
}
@media (min-width: 768px) {
  .pmv__img {
    aspect-ratio: 16/9;
  }
}
</style>
