import { useMemo, useState } from 'react'

type DropdownOption = {
  id: string
  label: string
}

type SearchableDropdownProps = {
  label: string
  options: DropdownOption[]
  placeholder?: string
  onChange?: (value: DropdownOption) => void
}

export function SearchableDropdown({
  label,
  options,
  placeholder = 'Search and select',
  onChange,
}: SearchableDropdownProps) {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string>('')

  const selectedOption = options.find((option) => option.id === selectedId)

  const filteredOptions = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    if (!normalized) {
      return options
    }

    return options.filter((option) => option.label.toLowerCase().includes(normalized))
  }, [options, search])

  function selectOption(option: DropdownOption) {
    setSelectedId(option.id)
    setSearch(option.label)
    onChange?.(option)
  }

  return (
    <div className="ui-field-wrap">
      <label className="ui-field-label">{label}</label>
      <div className="ui-surface" style={{ padding: '0.6rem' }}>
        <input
          className="ui-search-input"
          value={search}
          placeholder={selectedOption?.label ?? placeholder}
          onChange={(event) => setSearch(event.target.value)}
        />
        <ul className="ui-dropdown-list" role="listbox" aria-label={label}>
          {filteredOptions.map((option) => (
            <li key={option.id}>
              <button
                className={`ui-dropdown-item ${selectedId === option.id ? 'ui-dropdown-item--active' : ''}`}
                onClick={() => selectOption(option)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
