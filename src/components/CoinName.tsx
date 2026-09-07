import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { cn } from '@/lib/utils'

export function CoinName({ name, className, as: As = 'span' }: { name: string; className?: string; as?: 'span' | 'strong' | 'h1' }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <As className={cn('block truncate', className)}>{name}</As>
      </TooltipTrigger>
      <TooltipContent>{name}</TooltipContent>
    </Tooltip>
  )
}
