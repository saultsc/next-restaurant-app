import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export const MesasAssign = () => {
  return (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="outline">Asignar mesas</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Asignar mesas</DialogTitle>
          <div className="mt-2">
            <DialogDescription>Selecciona las mesas que deseas asignar a esta sala.</DialogDescription>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-4">
            <span className="font-semibold">Mesas disponibles</span>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="mesa1" />
                <label htmlFor="mesa1">Mesa 1</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="mesa2" />
                <label htmlFor="mesa2">Mesa 2</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="mesa3" />
                <label htmlFor="mesa3">Mesa 3</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="mesa4" />
                <label htmlFor="mesa4">Mesa 4</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="mesa5" />
                <label htmlFor="mesa5">Mesa 5</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="mesa6" />
                <label htmlFor="mesa6">Mesa 6</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="mesa7" />
                <label htmlFor="mesa7">Mesa 7</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="mesa8" />
                <label htmlFor="mesa8">Mesa 8</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="mesa9" />
                <label htmlFor="mesa9">Mesa 9</label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <span className="font-semibold">Mesas asignadas</span>
            <div className="col-span-2 flex flex-wrap gap-2">
              <div className="rounded-md bg-muted px-2 py-1 text-sm">Mesa 1</div>
              <div className="rounded-md bg-muted px-2 py-1 text-sm">Mesa 3</div>
              <div className="rounded-md bg-muted px-2 py-1 text-sm">Mesa 6</div>
            </div>
          </div>
          <Button type="submit" className="w-full">
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}