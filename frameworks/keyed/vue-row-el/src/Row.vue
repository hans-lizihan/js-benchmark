<script setup>
const props = defineProps({
  label: String,
  selected: Boolean,
  id: Number,
})
const emit = defineEmits(['select', 'remove'])
</script>
<template>
  <tr
    :data-label="label"
    :class="{ danger: props.selected }"
  >
    <td class="col-md-1">{{ props.id }}</td>
    <td class="col-md-4">
      <a @click="$emit('select', props.id)">{{ props.label }}</a>
    </td>
    <td class="col-md-1">
      <a @click="$emit('remove', props.id)">
        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
      </a>
    </td>
    <td class="col-md-6"></td>
  </tr>
</template>
