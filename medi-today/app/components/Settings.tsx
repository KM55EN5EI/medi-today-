import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SettingsIcon } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface SettingsProps {
  timeRanges: {
    morning: { start: number; end: number }
    afternoon: { start: number; end: number }
    evening: { start: number; end: number }
    night: { start: number; end: number }
  }
  onSave: (newSettings: SettingsType) => void
  currentSettings: SettingsType
}

export interface SettingsType {
  timeRanges: SettingsProps["timeRanges"]
  language: string
  lowStockThreshold: number
}

const languageFlags: { [key: string]: string } = {
  en: "🇺🇸",
  es: "🇪🇸",
  fr: "🇫🇷",
}

export function Settings({ timeRanges, onSave, currentSettings }: SettingsProps) {
  const [localSettings, setLocalSettings] = useState<SettingsType>({
    timeRanges,
    ...currentSettings,
  })

  const handleSave = () => {
    onSave(localSettings)
  }

  const handleTimeRangeChange = (period: keyof typeof timeRanges, values: number[]) => {
    setLocalSettings((prev) => ({
      ...prev,
      timeRanges: {
        ...prev.timeRanges,
        [period]: {
          start: values[0],
          end: values[1],
        },
      },
    }))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Customize your MediToday experience</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="language">Language</Label>
            <div className="flex gap-2">
              {Object.entries(languageFlags).map(([lang, flag]) => (
                <Button
                  key={lang}
                  variant={localSettings.language === lang ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLocalSettings((prev) => ({ ...prev, language: lang }))}
                >
                  {flag}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
            <Input
              id="lowStockThreshold"
              type="number"
              value={localSettings.lowStockThreshold}
              onChange={(e) =>
                setLocalSettings((prev) => ({ ...prev, lowStockThreshold: Number.parseInt(e.target.value) }))
              }
            />
          </div>
          <div className="space-y-4">
            <Label>Medicine Time Ranges</Label>
            {Object.entries(localSettings.timeRanges).map(([period, range]) => (
              <div key={period} className="space-y-2">
                <Label htmlFor={`${period}-range`} className="capitalize">
                  {period}
                </Label>
                <Slider
                  id={`${period}-range`}
                  min={0}
                  max={24}
                  step={1}
                  value={[range.start, range.end]}
                  onValueChange={(values) => handleTimeRangeChange(period as keyof typeof timeRanges, values)}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{range.start}:00</span>
                  <span>{range.end}:00</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

