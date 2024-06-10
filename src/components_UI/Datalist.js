'use client'
import { useState, useEffect, useRef } from 'react'

const Datalist = ({ className, list, setBlank = false, setter = null, auxRef = null }) => {
    const [value, setValue] = useState('')
    const [isDatalistVisible, setDatalistVisibility] = useState(false)
    const [filteredOptions, setFilteredOptions] = useState([])
    const [hasAutoSelected, setHasAutoSelected] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [style, setStyle] = useState(null)
    const inputRef = useRef(null)
    const divRef = useRef(null) // Referencia al elemento fijo
    const datalistRef = useRef(null) // Referencia al contenedor .c-datalist

    const handleOptionClick = (option) => {
        if(setBlank)
            setValue('')
        else
            setValue(option.value)
        if(setter)
            setter(option)
        setDatalistVisibility(false)
        setHasAutoSelected(true)
    }

    
    const handleKeyDown = (e) => {
        if(!isDatalistVisible)
            setDatalistVisibility(true)
        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault()
                handleArrowUp()
                break;
            case 'ArrowDown':
                e.preventDefault()
                handleArrowDown()
                break;
            case 'Enter':
                e.preventDefault()
                handleEnter()
                break
            default:
                break
        }
    };

    const handleArrowUp = () => {
        setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0))
        if(divRef.current)
            divRef.current.scrollTop =  Math.max(divRef.current.scrollTop - 49, 0);
    }

    const handleArrowDown = () => {
        setHighlightedIndex((prevIndex) =>
            Math.min(prevIndex + 1, filteredOptions.length - 1)
        )
        if(divRef.current && highlightedIndex > 0)
            divRef.current.scrollTop += 49
    }

    const handleEnter = () => {
        if (highlightedIndex !== -1) {
            if(setBlank)
                setValue('')
            else
                setValue(filteredOptions[highlightedIndex].value)
            if(setter)
                setter(filteredOptions[highlightedIndex])
            setDatalistVisibility(false)
            setHasAutoSelected(true);
        }
    }

    const handleInputBlur = () => {
        // Use setTimeout para permitir que el clic en la opción ocurra antes de ocultar el datalist
        setTimeout(() => {
            setDatalistVisibility(false)
        }, 200)
    };

    useEffect(() => {
        const handleScroll = (event) => {
            if (!datalistRef.current.contains(event.target)) {
                setDatalistVisibility(false)
            }
        }

        document.addEventListener('scroll', handleScroll, true)
    
        return () => {
            // Limpiar el evento al desmontar el componente
            document.removeEventListener('scroll', handleScroll, true)
        }
    }, [datalistRef.current, setDatalistVisibility])

    useEffect(() => {
        if(isDatalistVisible)
        {
            const rect = datalistRef.current.getBoundingClientRect()
            const windowHeight = window.innerHeight || document.documentElement.clientHeight
            
            // Verificar si el elemento está dentro del área visible de la pantalla
            const isVisible = rect.top < windowHeight && rect.bottom >= 0

            if(isVisible)
            {
                setStyle(
                    {
                        width: `${datalistRef.current.offsetWidth}px`,
                        top: `${rect.bottom + 2}px`,
                        left:  `${rect.left}px`,
                    }
                )
            }
        }
        else
        {
            setStyle(null)
        }
    }, [isDatalistVisible])
    
    useEffect(() => {
        if (auxRef) {
            auxRef.current = inputRef.current
        }
    }, [auxRef]);

    
    useEffect(() => {
        // Filtrar opciones cuando el valor del input cambia
        if(value !== '')
            setFilteredOptions(list)
        else
        {
            const filtered = list?.filter((option) =>
              option?.value?.toLowerCase().includes(value?.toLowerCase())
            )
            setFilteredOptions(filtered)
            if(filtered && filtered.length === 1 && !hasAutoSelected)
            {
                if(setBlank)
                    setValue('')
                else
                    setValue(filtered[0].value)
                if(setter)
                    setter(filtered[0])
                setDatalistVisibility(false)
                setHasAutoSelected(true)
            } else if(filtered && filtered.length > 1) {
                setHasAutoSelected(false)
            }
        }
    }, [value, list])

    return (
        <div 
            ref={datalistRef}
            className={`c-datalist ${className}`}
            onBlur={handleInputBlur}
            onClick={() =>  setDatalistVisibility(true)}
            onFocus={() =>  {
                setDatalistVisibility(true)
                inputRef.current.focus()
            }}
            tabIndex={0}
        >
            <input 
                ref={inputRef}
                className={'u-1/1 c-input'} 
                value={value} 
                onChange={e => {
                    setValue(e.target.value)
                    if(setter)
                        setter(e.target.value)
                }} 
                onFocus={() => setDatalistVisibility(true)}
                onKeyDown={handleKeyDown}
            />
            {
                list && list[0]?.value && isDatalistVisible && style &&
                <ul 
                    className="c-datalist__list"
                    ref={divRef}
                    style={
                        style
                    }
                >
                    {           
                        filteredOptions?.map((option, index) => (
                            <li 
                                className={`c-datalist__li ${highlightedIndex === index ? 'c-datalist__li--highlighted' : ''}`}
                                key={index} 
                                onClick={() => handleOptionClick(option)}
                            >
                                {option.value}
                            </li>
                        ))
                    }
                </ul>
            }
        </div>
    )
}

export default Datalist