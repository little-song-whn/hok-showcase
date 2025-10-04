import * as React from 'react'
import * as RTabs from '@radix-ui/react-tabs'

export const Tabs = RTabs.Root
export const TabsList = (props: React.ComponentProps<typeof RTabs.List>) => (
  <RTabs.List {...props} className={'inline-flex gap-1 rounded-xl border p-1 bg-white ' + (props.className ?? '')} />
)
export const TabsTrigger = (props: React.ComponentProps<typeof RTabs.Trigger>) => (
  <RTabs.Trigger
    {...props}
    className={
      'px-3 py-1.5 text-sm rounded-lg data-[state=active]:bg-gray-100 outline-none ' +
      (props.className ?? '')
    }
  />
)
export const TabsContent = RTabs.Content
