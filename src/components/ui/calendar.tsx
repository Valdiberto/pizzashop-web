'use client'

import * as React from 'react'

import { ptBR } from 'react-day-picker/locale'
import { cn } from '@/lib/utils'
import { DayPicker, getDefaultClassNames } from 'react-day-picker'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { addMonths, subMonths } from 'date-fns'

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames()
  const [month, setMonth] = useState(new Date())

  function handlePrev() {
    setMonth((prev) => subMonths(prev, 1))
  }

  function handleNext() {
    setMonth((prev) => addMonths(prev, 1))
  }
  return (
    <>
      <div className="flex-row px-3">
        <div className="flex justify-center gap-5">
          <button onClick={handlePrev} className="hover:bg-muted rounded p-1">
            <ChevronLeft className="text-muted-foreground h-5 w-5" />
          </button>

          <button onClick={handleNext} className="hover:bg-muted rounded p-1">
            <ChevronRight className="text-muted-foreground h-5 w-5" />
          </button>
        </div>

        <DayPicker
          showOutsideDays={showOutsideDays}
          className={cn('p-3', className)}
          month={month}
          onMonthChange={setMonth}
          hideNavigation
          locale={ptBR}
          classNames={{
            months: 'flex flex-col sm:flex-row gap-4',
            month: 'space-y-4',
            caption_label: 'text-xl font-medium',
            chevron: 'fill-muted-foreground',
            day: cn(
              defaultClassNames.day,
              'w-10 h-10 p-0 text-sm align-center rounded-md transition-colors',
              'hover:bg-muted-foreground hover:text-accent focus:outline-none focus-visible:ring-2',
            ),

            today: `${defaultClassNames.today} bg-muted-foreground text-accent`,
            selected: `${defaultClassNames.selected} bg-primary text-primary-foreground`,
            disabled: 'text-muted-foreground opacity-50',
            outside: 'text-muted-foreground opacity-40',

            ...classNames,
          }}
          {...props}
        />
      </div>
    </>
  )
}
