type StatCardProps = {
  label: string
  value: string
  detail: string
}

export function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <article className="ui-card">
      <div className="ui-card__body">
        <p style={{ margin: 0, color: '#4f7a66', fontSize: '0.78rem', textTransform: 'uppercase' }}>{label}</p>
        <p style={{ margin: 0, color: '#0f5233', fontSize: '1.5rem', fontWeight: 700 }}>{value}</p>
        <p className="ui-card__text">{detail}</p>
      </div>
    </article>
  )
}
