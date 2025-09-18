<script setup lang="ts">
/* Types (در صورت داشتن types سراسری، حذف/ایمپورت کن) */
export type IDimensions = { width: number; depth: number; height: number };
export type IReview = {
  date: string;
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerEmail: string;
};
export type IMeta = {
  qrCode: string;
  barcode: string;
  createdAt: string;
  updatedAt: string;
};
export type IProduct = {
  id: number;
  sku: string;
  meta: IMeta;
  title: string;
  price: number;
  stock: number;
  brand: string;
  weight: number;
  tags: string[];
  rating: number;
  category: string;
  images: string[];
  thumbnail: string;
  reviews: IReview[];
  description: string;
  returnPolicy: string;
  dimensions: IDimensions;
  discountPercentage: number;
  availabilityStatus: string;
  warrantyInformation: string;
  shippingInformation: string;
  minimumOrderQuantity: number;
};

const props = withDefaults(
  defineProps<{
    product: IProduct;
    compact?: boolean; // حالت فشرده کارت
    to?: string; // لینک جزئیات (اختیاری)
  }>(),
  { compact: false }
);

const emit = defineEmits<{
  (e: 'add', p: IProduct): void;
  (e: 'view', p: IProduct): void;
}>();

/* محاسبات نمایش */
const hasDiscount = computed(() => props.product.discountPercentage > 0);
const priceFinal = computed(() => {
  return hasDiscount.value
    ? +(
        props.product.price *
        (1 - props.product.discountPercentage / 100)
      ).toFixed(2)
    : props.product.price;
});
const priceOriginal = computed(() => props.product.price);
const priceText = (n: number) =>
  n.toLocaleString(undefined, { minimumFractionDigits: 0 });
const stockLabel = computed(() => {
  const s = props.product.stock;
  if (s <= 0) return 'Out of stock';
  if (s < props.product.minimumOrderQuantity) return 'Below MOQ';
  if (s <= 5) return 'Low stock';
  return 'In stock';
});
const stockTone = computed(() =>
  props.product.stock <= 0 ? 'danger' : props.product.stock <= 5 ? 'warn' : 'ok'
);
const stars = computed(() =>
  '★★★★★☆☆☆☆☆'.slice(
    5 - Math.round(props.product.rating),
    10 - Math.round(props.product.rating)
  )
);

function addToCart() {
  emit('add', props.product);
}
function viewDetails() {
  emit('view', props.product);
}
</script>

<template>
  <article class="card prod">
    <!-- تصویر -->
    <div
      class="prod__media"
      @click="viewDetails"
      role="button"
      tabindex="0"
      @keydown.enter="viewDetails"
    >
      <img
        v-if="product.thumbnail"
        class="prod__img"
        :src="product.thumbnail"
        :alt="product.title"
        loading="lazy"
      />
      <div v-else class="prod__img prod__img--placeholder">No Image</div>

      <div v-if="hasDiscount" class="prod__badge" aria-label="Discount">
        -{{ Math.round(product.discountPercentage) }}%
      </div>
    </div>

    <!-- بدنه -->
    <div class="prod__body">
      <header class="prod__head">
        <h3 class="prod__title" :title="product.title">
          <NuxtLink v-if="to" :to="to">{{ product.title }}</NuxtLink>
          <span v-else>{{ product.title }}</span>
        </h3>
        <div class="prod__brand">{{ product.brand }}</div>
      </header>

      <div class="prod__meta">
        <div class="prod__price">
          <span class="prod__price--final">${{ priceText(priceFinal) }}</span>
          <span v-if="hasDiscount" class="prod__price--original"
            >${{ priceText(priceOriginal) }}</span
          >
        </div>
        <div class="prod__rating" :aria-label="`Rating ${product.rating} of 5`">
          ★ {{ product.rating.toFixed(1) }}
        </div>
      </div>

      <p v-if="!compact" class="prod__desc" :title="product.description">
        {{ product.description }}
      </p>

      <div class="prod__tags" v-if="product.tags?.length">
        <span v-for="t in product.tags.slice(0, 3)" :key="t" class="tag">{{
          t
        }}</span>
      </div>

      <div class="prod__info">
        <span class="prod__stock" :data-tone="stockTone">{{ stockLabel }}</span>
        <span class="prod__cat">{{ product.category }}</span>
      </div>

      <div class="prod__actions">
        <UiButton class="prod__btn" variant="ghost" @click="viewDetails"
          >Details</UiButton
        >
        <UiButton class="prod__btn" variant="primary" @click="addToCart"
          >Add</UiButton
        >
      </div>
    </div>
  </article>
</template>

<style scoped>
/* ـــــ wrapper عمومی کارت ـــــ */
.prod {
  display: grid;
  gap: var(--sp-3);
  overflow: hidden;
}

/* ـــــ تصویر ـــــ */
.prod__media {
  position: relative;
  border-radius: var(--radius-sm);
  overflow: hidden;
  cursor: pointer;
}
.prod__img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
}
.prod__img--placeholder {
  display: grid;
  place-items: center;
  background: var(--surface-alt);
  color: var(--muted);
  aspect-ratio: 4 / 3;
}

/* نشان تخفیف */
.prod__badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: var(--primary);
  color: var(--primary-foreground);
  border-radius: 999px;
  padding: 0.15rem 0.5rem;
  font-size: 12px;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

/* ـــــ بدنه ـــــ */
.prod__body {
  display: grid;
  gap: var(--sp-3);
}

/* هدر کارت */
.prod__head {
  display: grid;
  gap: 2px;
}
.prod__title {
  margin: 0;
  font-size: var(--fs-2);
  line-height: 1.3;
  font-weight: 700;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.prod__title a {
  color: inherit;
  text-decoration: none;
}
.prod__brand {
  font-size: var(--fs-0);
  color: var(--muted);
}

/* قیمت و امتیاز */
.prod__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
}
.prod__price {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}
.prod__price--final {
  font-weight: 800;
  font-size: var(--fs-3);
}
.prod__price--original {
  color: #9aa3ad;
  text-decoration: line-through;
  font-size: var(--fs-1);
}
.prod__rating {
  font-size: var(--fs-0);
  color: #b7791f;
} /* کهربایی ملایم */

/* توضیح کوتاه */
.prod__desc {
  margin: 0;
  color: color-mix(in oklab, var(--fg) 70%, white 30%);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* تگ‌ها */
.prod__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

/* اطلاعات وضعیت/دسته */
.prod__info {
  display: flex;
  justify-content: space-between;
  gap: var(--sp-3);
  font-size: var(--fs-0);
}
.prod__stock[data-tone='ok'] {
  color: #166534;
} /* سبز ملایم */
.prod__stock[data-tone='warn'] {
  color: #a16207;
} /* زرد تیره */
.prod__stock[data-tone='danger'] {
  color: #991b1b;
} /* قرمز تیره */
.prod__cat {
  color: var(--muted);
}

/* اکشن‌ها */
.prod__actions {
  display: flex;
  gap: 0.5rem;
}
.prod__btn {
  flex: 1;
}

/* ریسپانسیو ریز */
@media (max-width: 480px) {
  .prod__price--final {
    font-size: var(--fs-2);
  }
}
</style>
