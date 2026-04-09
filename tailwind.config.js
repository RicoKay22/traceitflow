/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono:  ['Space Mono', 'monospace'],
        code:  ['JetBrains Mono', 'monospace'],
        body:  ['DM Sans', 'sans-serif'],
      },
      colors: {
        'bg-base':      'var(--bg-base)',
        'bg-surface':   'var(--bg-surface)',
        'bg-elevated':  'var(--bg-elevated)',
        'accent':       'var(--accent-primary)',
        'accent-2':     'var(--accent-secondary)',
        'danger':       'var(--accent-danger)',
        'warning':      'var(--accent-warning)',
        'text-primary': 'var(--text-primary)',
        'text-muted':   'var(--text-muted)',
        'border-col':   'var(--border)',
      },
      animation: {
        'bar-pulse': 'bar-pulse 0.6s ease-in-out infinite',
        'fade-in':   'fadeIn 0.3s ease forwards',
      },
    },
  },
  plugins: [],
}
