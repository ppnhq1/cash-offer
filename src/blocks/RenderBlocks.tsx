import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { AreaServedBlock } from '@/blocks/AreaServed/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ComparisonTableBlock } from '@/blocks/ComparisonTable/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FAQBlock } from '@/blocks/FAQ/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { HowItWorksBlock } from '@/blocks/HowItWorks/Component'
import { IconGridBlock } from '@/blocks/IconGrid/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { QuoteBannerBlock } from '@/blocks/QuoteBanner/Component'
import { SplitContentBlock } from '@/blocks/SplitContent/Component'
import { StatRowBlock } from '@/blocks/StatRow/Component'
import { TestimonialsBlock } from '@/blocks/Testimonials/Component'

const blockComponents = {
  archive: ArchiveBlock,
  areaServed: AreaServedBlock,
  comparisonTable: ComparisonTableBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  faq: FAQBlock,
  formBlock: FormBlock,
  howItWorks: HowItWorksBlock,
  iconGrid: IconGridBlock,
  mediaBlock: MediaBlock,
  quoteBanner: QuoteBannerBlock,
  splitContent: SplitContentBlock,
  statRow: StatRowBlock,
  testimonials: TestimonialsBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
