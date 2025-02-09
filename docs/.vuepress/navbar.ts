import { defineNavbarConfig } from 'vuepress-theme-plume'

export const navbar = defineNavbarConfig([
  // icon可以从https://icon-sets.iconify.design/查
  { text: '首页', link: '/', icon: 'flat-color-icons:home' },
  {
    text: '博客文章',
    icon: 'flat-color-icons:kindle',
    items: [
      { text: '博客列表', link: '/blog/', icon: 'flat-color-icons:view-details' },
      { text: '标签索引', link: '/blog/tags/', icon: 'flat-color-icons:bookmark' },
      { text: '博客归档', link: '/blog/archives/', icon: 'flat-color-icons:opened-folder' }
    ]
  },
  {
    text: '专题栏目',
    icon: 'flat-color-icons:statistics',
    items: [
      { text: '模拟电路', link: '/analog/', icon: 'flat-color-icons:capacitor' },
      { text: '数字逻辑', link: '/digital/', icon: 'flat-color-icons:display' },
      { text: '微机原理', link: '/mcu/', icon: 'flat-color-icons:electronics' }
    ]
  },
])
