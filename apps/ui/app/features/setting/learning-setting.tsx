"use client"

import { useState } from "react"
import { toast } from "sonner"
import { IconChevronRight, IconTarget } from "@tabler/icons-react"
import { Card } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { updateUserSettings } from "@/services/user.service"
import type { UserSettings } from "@/types/user.types"

interface LearningSettingProps {
    settings: UserSettings | null
    onUpdated: (settings: UserSettings) => void
}

export function LearningSetting({ settings, onUpdated }: LearningSettingProps) {
    const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false)
    const [goalInput, setGoalInput] = useState(settings?.daily_goal.toString() ?? "20")
    const [isSavingGoal, setIsSavingGoal] = useState(false)

    const handleOpen = () => {
        setGoalInput(settings?.daily_goal.toString() ?? "20")
        setIsGoalDialogOpen(true)
    }

    const handleSaveGoal = async () => {
        const goalNum = parseInt(goalInput, 10)
        if (isNaN(goalNum) || goalNum < 1 || goalNum > 200) {
            toast.error("Vui lòng nhập mục tiêu từ 1 đến 200 từ/ngày")
            return
        }

        try {
            setIsSavingGoal(true)
            const updated = await updateUserSettings({ daily_goal: goalNum })
            onUpdated(updated)
            toast.success("Đã cập nhật mục tiêu học hàng ngày!")
            setIsGoalDialogOpen(false)
        } catch (error) {
            const message = error instanceof Error ? error.message : "Không thể cập nhật cài đặt"
            toast.error(message)
        } finally {
            setIsSavingGoal(false)
        }
    }

    const dailyGoalDesc = settings ? `${settings.daily_goal} từ mỗi ngày` : "20 từ mỗi ngày"

    return (
        <section className="flex flex-col gap-2">
            <h2 className="px-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Tiến độ & Mục tiêu (Learning)
            </h2>

            <Card className="p-0 overflow-hidden">
                <button
                    type="button"
                    onClick={handleOpen}
                    className="group flex w-full items-center gap-4 p-4 text-left transition hover:bg-muted/50"
                >
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <IconTarget size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium">Mục tiêu mỗi ngày (Daily goal)</p>
                        <p className="text-xs text-muted-foreground">{dailyGoalDesc}</p>
                    </div>
                    <IconChevronRight size={18} className="text-muted-foreground" />
                </button>
            </Card>

            <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
                <DialogContent className="max-w-xs sm:max-w-sm">
                    <DialogHeader>
                        <Label>Mục tiêu</Label>
                        <DialogDescription>
                            Đặt số lượng từ vựng bạn muốn học và ôn tập mỗi ngày.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-3 py-2">
                        <Label htmlFor="goal">Số từ mỗi ngày (1 - 100)</Label>
                        <Input
                            id="goal"
                            type="number"
                            min={1}
                            max={100}
                            value={goalInput}
                            onChange={(e) => setGoalInput(e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsGoalDialogOpen(false)}
                            disabled={isSavingGoal}
                        >
                            Hủy
                        </Button>
                        <Button onClick={handleSaveGoal} disabled={isSavingGoal}>
                            {isSavingGoal ? "Đang lưu..." : "Lưu cài đặt"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    )
}
