import { useReveal } from '../hooks/useReveal'

// Titular amb reveal per paraules: desenfocat + lleugerament desplaçat cap
// a nítid, amb stagger. Variant "premium" del fade-up genèric que ja s'usa
// a la resta de la web.
export default function RevealText({
as: Tag = 'h2',
children,
className = '',
threshold = 0.3,
delayStep = 0.06,
...rest
}) {
const ref = useReveal(threshold)
const words = String(children).split(' ')

return (
<Tag ref={ref} className={`reveal-text ${className}`} {...rest}>
{words.map((word, i) => (
<span className="reveal-text-word" key={`${word}-${i}`}>
<span
className="reveal-text-word-inner"
style={{ '--rt-delay': `${(i * delayStep).toFixed(2)}s` }}
>
{word}
{i < words.length - 1 ? '\u00A0' : ''}
</span>
</span>
))}
</Tag>
)
}
