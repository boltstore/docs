<template>
  <Layout>
    <template #doc-footer-before>
      <!-- no-op to ensure layout is overridden -->
    </template>
    <template #nav-bar-content-after>
      <button
        class="nav-search-trigger"
        aria-label="Search"
        @click="triggerSearch"
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" stroke-width="2" />
          <path d="m21 21-4.35-4.35" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
      <a href="/guide/overview" class="nav-docs-link">Docs</a>
    </template>
  </Layout>
</template>

<script setup>
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme

function triggerSearch() {
  const btn = document.querySelector('#local-search .DocSearch-Button')
  if (btn) btn.click()
}
</script>

<style scoped>
.nav-search-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 6px;
  transition: color 0.15s;
  pointer-events: auto;
}

.nav-search-trigger:hover {
  color: var(--text-primary);
}

.nav-docs-link {
  display: none;
  align-items: center;
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--accent-400);
  text-decoration: none;
  border: 1px solid var(--border-default);
  border-radius: 6px;
  transition: border-color 0.15s;
}

.nav-docs-link:hover {
  border-color: var(--accent-600);
}

@media (max-width: 767px) {
  .nav-search-trigger {
    display: none !important;
  }
  .nav-docs-link {
    display: inline-flex;
  }
}
</style>
