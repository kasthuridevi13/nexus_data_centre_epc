export default function TitleBlock({ sheet, title, subtitle, meta }) {
  return (
    <div className="title-block sheet-corner mb-6">
      <div className="tb-cell flex-1">
        <div className="tb-label">Sheet</div>
        <div className="tb-value">{sheet}</div>
      </div>
      <div className="tb-cell flex-[3]">
        <div className="tb-label">Module</div>
        <div className="font-display text-base font-600 text-ink-primary">{title}</div>
        {subtitle && <div className="text-xs text-ink-muted mt-0.5">{subtitle}</div>}
      </div>
      {meta && (
        <div className="tb-cell">
          <div className="tb-label">{meta.label}</div>
          <div className="tb-value">{meta.value}</div>
        </div>
      )}
    </div>
  );
}
