// Fix the broken CSS section
const fs = require('fs');
const path = 'D:\\PRACTICE\\css\\style.css';
let content = fs.readFileSync(path, 'utf8');

const broken = `/* Active filter indicator */

/* ============================================
   Courses Page - Course Grid & Cards
   padding-top: var(--space-md);
   border-top: 1px solid var(--color-border);
}

.filters__tag {
   font-size: var(--font-size-sm);
   color: var(--color-text-light);
}

.filters__tag strong {
   color: var(--color-accent);
}

/* ============================================
   Courses Page - Course Grid & Cards
   ============================================ */
.courses {
   padding: var(--space-4xl) 0;
}

.courses__grid {
   display: grid;
   grid-template-columns: 1fr;
   gap: var(--space-xl);
}

/* Course card (dynamically rendered) */`;

const fixed = `/* Active filter indicator */

/* ============================================
   Courses Page - Course Grid & Cards
   ============================================ */
.courses {
  padding: var(--space-4xl) 0;
}

.courses__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-xl);
}

.courses__empty {
  text-align: center;
  padding: var(--space-5xl) var(--space-xl);
}

.courses__empty-icon {
  font-size: 3rem;
  margin-bottom: var(--space-md);
}

.courses__empty-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--space-sm);
}

.courses__empty-text {
  font-size: var(--font-size-base);
  color: var(--color-text-light);
}

/* Course card (dynamically rendered) */`;

content = content.replace(broken, fixed);
fs.writeFileSync(path, content);
console.log('CSS fixed successfully');