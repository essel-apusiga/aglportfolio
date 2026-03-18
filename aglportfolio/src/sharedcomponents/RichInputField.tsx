import { useMemo, useState } from 'react'

type RichInputOption = {
  id: string
  label: string
  hint?: string
}

type RichInputFieldProps = {
  label: string
  placeholder?: string
  options: RichInputOption[]
  onSelect?: (option: RichInputOption) => void
}

export function RichInputField({ label, placeholder = 'Search', options, onSelect }: RichInputFieldProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) {
      return options
    }

    return options.filter((option) => option.label.toLowerCase().includes(normalized))
  }, [options, query])

  function handleSelect(option: RichInputOption) {
    setQuery(option.label)
    setOpen(false)
    onSelect?.(option)
  }

  return (
    <div className="ui-field-wrap">
      <label className="ui-field-label">{label}</label>
      <div className="ui-surface" style={{ padding: '0.6rem' }}>
        <input
          className="ui-search-input"
          value={query}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
        />
        {open ? (
          <ul className="ui-dropdown-list" role="listbox">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li key={option.id}>
                  <button className="ui-dropdown-item" onMouseDown={() => handleSelect(option)}>
                    <div>{option.label}</div>
                    {option.hint ? <small>{option.hint}</small> : null}
                  </button>
                </li>
              ))
            ) : (
              <li style={{ padding: '0.5rem 0.65rem', color: '#5a7c69' }}>No results</li>
            )}
          </ul>
        ) : null}
      </div>
    </div>
  )
}
