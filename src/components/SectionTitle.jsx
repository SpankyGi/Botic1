/**
 * Reusable section heading.
 * @param {string}  eyebrow   - Small label above the heading (gold, uppercase)
 * @param {string}  heading   - Main heading text
 * @param {string}  body      - Optional body paragraph
 * @param {'dark'|'light'} theme - Color theme (default 'dark')
 * @param {'left'|'center'} align
 */
export default function SectionTitle({
  eyebrow,
  heading,
  body,
  theme = 'dark',
  align = 'left',
  as: Tag = 'h2',
}) {
  const isDark = theme === 'dark'
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start'

  return (
    <div className={`flex flex-col ${alignClass} gap-4`}>
      {eyebrow && (
        <span className="text-[11px] tracking-[0.28em] uppercase text-botic-gold font-sans font-medium">
          {eyebrow}
        </span>
      )}
      <Tag
        className={`font-serif font-light leading-[1.05] tracking-tight ${
          isDark ? 'text-botic-cream' : 'text-botic-text'
        }`}
      >
        {heading}
      </Tag>
      {body && (
        <p
          className={`font-sans text-sm md:text-base leading-relaxed max-w-lg ${
            isDark ? 'text-botic-muted' : 'text-botic-text/70'
          }`}
        >
          {body}
        </p>
      )}
    </div>
  )
}
