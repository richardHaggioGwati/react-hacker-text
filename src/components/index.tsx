import React, { useState, useEffect, useRef } from 'react'
import hackerTextFunction from './hackerTextFunction'
import * as utils from './utils'

interface HackerTextProps {
  text: string
  changes?: number
  speed?: number
  delay?: number
  characters?: string 
  onStart?: () => void
  onFinished?: () => void
  element?: keyof JSX.IntrinsicElements
}

const HackerText: React.FC<HackerTextProps> = ({
  text,
  changes = 4,
  speed = 50,
  delay = 0,
  characters,
  onStart,
  onFinished,
  element = 'span',
  ...props
}) => {
  const [hackerText, setHackerText] = useState<string>('')
  const changingLetterRef = useRef<{ index: number; changes: number }>({
    index: 0,
    changes: 0,
  })
  const timeoutDelayRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutWriteRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    timeoutDelayRef.current = setTimeout(() => {
      if (onStart) onStart()
      write()
    }, delay)

    return () => {
      clearTimeout(timeoutDelayRef.current!)
      clearTimeout(timeoutWriteRef.current!)
    }
  }, [text, delay, onStart])

  useEffect(() => {
    //TODO:
    //@ts-expect-error
    if (text !== props.text) {
      changingLetterRef.current = { index: 0, changes: 0 }
      timeoutDelayRef.current = setTimeout(() => {
        if (onStart) onStart()
        write()
      }, delay)
    }

    return () => {
      clearTimeout(timeoutDelayRef.current!)
      clearTimeout(timeoutWriteRef.current!)
    }
  }, [text, delay, onStart])

  const write = () => {
    const isLastChange = changingLetterRef.current.changes === changes - 1
    const character = isLastChange
      ? text[changingLetterRef.current.index]
      : utils.randomCharacter(text[changingLetterRef.current.index], characters)

    setHackerText(
      `${text.substring(0, changingLetterRef.current.index)}${character}`
    )

    changingLetterRef.current.changes++
    if (changingLetterRef.current.changes >= changes) {
      changingLetterRef.current = {
        index: ++changingLetterRef.current.index,
        changes: 0,
      }
    }

    if (changingLetterRef.current.index < text.length) {
      timeoutWriteRef.current = setTimeout(write, speed)
    } else {
      setHackerText(text)
      if (onFinished) onFinished()
    }
  }

  return React.createElement(element, props, hackerText)
}

export { hackerTextFunction }
export default HackerText