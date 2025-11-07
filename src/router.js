import { createRouter, createWebHistory } from 'vue-router'
import ChatPage from '@/pages/ChatPage.vue'
import SettingsPage from '@/pages/SettingsPage.vue'
import HelpPage from '@/pages/HelpPage.vue'

const routes = [
  {
    path: '/',
    name: 'Chat',
    component: ChatPage,
    meta: {
      title: 'Chat - Chat-UI',
      description: 'Start a conversation with MiniMax M2 AI'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsPage,
    meta: {
      title: 'Settings - Chat-UI',
      description: 'Configure your Chat-UI preferences'
    }
  },
  {
    path: '/help',
    name: 'Help',
    component: HelpPage,
    meta: {
      title: 'Help - Chat-UI',
      description: 'Get help and support for Chat-UI'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: {
      title: 'Page Not Found - Chat-UI',
      description: 'The page you are looking for does not exist'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Set document title
  document.title = to.meta.title || 'Chat-UI'
  
  // Set meta description
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', to.meta.description || 'Chat-UI - Conversational AI Interface')
  }
  
  next()
})

export default router