<script setup lang="ts">
import { computed, ref } from 'vue';

// ------ Variables ------
const inputRef = ref<HTMLInputElement>();
defineExpose({ focus: () => inputRef.value?.focus() });
const model = defineModel<string | number | null>({ default: '' });

// ------ Props ------
const props = withDefaults(
  defineProps<{
    id?: string;
    hint?: string;
    error?: string;
    label?: string;
    disabled?: boolean;
    placeholder?: string;
    size?: 'sm' | 'md' | 'lg';
    type?: 'text' | 'number' | 'email' | 'password';
  }>(),
  { type: 'text', size: 'md' }
);

// ------ Computed ------
const uid = computed(
  () => props.id ?? `in-${Math.random().toString(36).slice(2, 8)}`
);

// ------ Methods ------
function onInput(e: Event) {
  const el = e.target as HTMLInputElement;
  model.value =
    props.type === 'number'
      ? el.value === ''
        ? null
        : Number(el.value)
      : el.value;
}
</script>

<template>
  <label class="field" :for="uid">
    <span v-if="label" class="field__label">{{ label }}</span>

    <div class="field__control">
      <span v-if="$slots.prefix" class="field__prefix"
        ><slot name="prefix"
      /></span>

      <input
        ref="inputRef"
        :id="uid"
        class="input"
        :class="[
          {
            'is-invalid': !!error,
            'has-prefix': !!$slots.prefix,
            'has-suffix': !!$slots.suffix,
          },
          size === 'sm' && 'input--sm',
          size === 'lg' && 'input--lg',
        ]"
        :type="props.type"
        :placeholder="placeholder"
        :disabled="disabled"
        :value="model ?? ''"
        @input="onInput"
        :aria-invalid="!!error"
        :aria-describedby="
          error ? uid + '-err' : hint ? uid + '-hint' : undefined
        "
      />

      <span v-if="$slots.suffix" class="field__suffix"
        ><slot name="suffix"
      /></span>
    </div>

    <p v-if="error" class="field__error" :id="uid + '-err'">{{ error }}</p>
    <p v-else-if="hint" class="field__hint" :id="uid + '-hint'">{{ hint }}</p>
  </label>
</template>
