import CpNavBar from '@/components/cp-nav-bar.vue'
import CpIcon from '@/components/cp-icon.vue'

declare module 'vue' {
  interface GlobalComponents {
    CpNavBar: typeof CpNavBar
    CpIcon: typeof CpIcon
  }
}
