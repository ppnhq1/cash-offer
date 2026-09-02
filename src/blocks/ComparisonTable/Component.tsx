import React from 'react'
import { Check, X } from 'lucide-react'

import type { ComparisonTableBlock as ComparisonTableBlockProps } from '@/payload-types'

export const ComparisonTableBlock: React.FC<ComparisonTableBlockProps> = ({
  heading,
  subheading,
  ourColumnLabel,
  agentColumnLabel,
  rows,
}) => {
  return (
    <div className="container">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <h2 className="text-3xl font-bold md:text-4xl">{heading}</h2>
        {subheading && <p className="mt-4 text-lg text-base-content/80">{subheading}</p>}
      </div>

      <div className="max-w-full overflow-x-auto rounded-box border border-base-content/10 bg-base-100">
        <table className="table table-lg">
          <thead>
            <tr>
              <th></th>
              <th className="text-base font-bold text-primary">
                <Check className="mr-1 inline size-4" aria-hidden="true" />
                {ourColumnLabel}
              </th>
              <th className="text-base font-bold text-base-content/70">
                <X className="mr-1 inline size-4" aria-hidden="true" />
                {agentColumnLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {(rows || []).map((row, index) => (
              <tr key={index} className="transition-colors duration-200 hover:bg-base-200/60">
                <th className="font-semibold">{row.label}</th>
                <td className="text-primary">{row.ourValue}</td>
                <td className="text-base-content/70 italic">{row.agentValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
