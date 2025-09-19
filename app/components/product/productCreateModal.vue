<script setup lang="ts">
import type { IProduct } from '~/types/product';

const open = defineModel<boolean>('open', { default: false });

const title = ref(''),
  brand = ref(''),
  category = ref(''),
  description = ref('');
const price = ref<number | null>(null);
const pending = ref(false);
const err = ref<string | null>(null);

const emit = defineEmits<{ (e: 'created', p: IProduct): void }>();

async function submit() {
  err.value = null;
  if (!title.value || price.value == null || isNaN(price.value)) {
    err.value = 'Title و Price الزامی‌اند.';
    return;
  }
  pending.value = true;
  try {
    const p = await $fetch<IProduct>('/api/products', {
      method: 'POST',
      body: JSON.stringify({
        title: title.value.trim(),
        price: Number(price.value),
        brand: brand.value.trim(),
        category: category.value.trim(),
        description: description.value.trim(),
      }),
    });
    emit('created', p);
    open.value = false;
  } catch (e: any) {
    err.value = e?.statusMessage || 'Request failed.';
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <UiModal v-model:open="open">
    <header class="pm__header">
      <h3 class="pm__title">New Product</h3>
      <UiButton @click="open = false">Close</UiButton>
    </header>

    <form class="pm__form" @submit.prevent="submit">
      <UiInput v-model="title" label="Title" placeholder="Product title" />
      <UiInput v-model="brand" label="Brand" placeholder="Brand (optional)" />
      <UiInput
        v-model="category"
        label="Category"
        placeholder="Category (optional)"
      />
      <UiInput v-model="price" type="number" label="Price" placeholder="0.00" />
      <UiInput
        v-model="description"
        label="Description"
        placeholder="Short description"
      />
      <p v-if="err" class="pm__err">{{ err }}</p>

      <div class="pm__actions">
        <UiButton type="button" @click="open = false">Cancel</UiButton>
        <UiButton type="submit" variant="primary" :loading="pending"
          >Create</UiButton
        >
      </div>
    </form>
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
.pm__form {
  display: grid;
  gap: var(--sp-3);
  margin-top: var(--sp-4);
}
.pm__actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
.pm__err {
  margin: 0;
  color: #b91c1c;
}
</style>
