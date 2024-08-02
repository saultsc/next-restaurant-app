import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CirclePlus, MinusCircle } from 'lucide-react';

export default function Component() {
	return (
		<div className="p-4 mt-6">
			<div className="flex items-center justify-between space-x-4 mb-4">
				<div className="flex space-x-4">
					<Input type="search" placeholder="Usuario" />
					<Button variant="default" className="bg-blue-600 hover:bg-blue-700">
						<SearchIcon className="mr-2 h-4 w-4" />
						BUSCAR
					</Button>
				</div>
				<div className="flex space-x-4">
					<SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Button variant="default" className="ml-auto bg-green-600 hover:bg-green-700 text-white">
						<PlusIcon className="mr-2 h-4 w-4" />
						AGREGAR
					</Button>
				</div>
			</div>
			<Card>
				<CardHeader className="bg-black/90 rounded-t-md text-white">
					<CardTitle>Usuarios</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='h-[560px] overflow-y-auto'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Codigo</TableHead>
									<TableHead>Nombre</TableHead>
									<TableHead>Correo</TableHead>
									<TableHead>Role</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow>
									<TableCell>1</TableCell>
									<TableCell>Carlos Felipe</TableCell>
									<TableCell>carlosfelipe@gmail.com</TableCell>
									<TableCell>
										<Badge variant="default">Adminstrador</Badge>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>2</TableCell>
									<TableCell>Georges Pipero</TableCell>
									<TableCell>geroges@gmail.com</TableCell>
									<TableCell>
										<Badge variant="default">Usuario</Badge>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>2</TableCell>
									<TableCell>Georges Pipero</TableCell>
									<TableCell>geroges@gmail.com</TableCell>
									<TableCell>
										<Badge variant="default">Usuario</Badge>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>2</TableCell>
									<TableCell>Georges Pipero</TableCell>
									<TableCell>geroges@gmail.com</TableCell>
									<TableCell>
										<Badge variant="default">Usuario</Badge>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>2</TableCell>
									<TableCell>Georges Pipero</TableCell>
									<TableCell>geroges@gmail.com</TableCell>
									<TableCell>
										<Badge variant="default">Usuario</Badge>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>2</TableCell>
									<TableCell>Georges Pipero</TableCell>
									<TableCell>geroges@gmail.com</TableCell>
									<TableCell>
										<Badge variant="default">Usuario</Badge>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>2</TableCell>
									<TableCell>Georges Pipero</TableCell>
									<TableCell>geroges@gmail.com</TableCell>
									<TableCell>
										<Badge variant="default">Usuario</Badge>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>2</TableCell>
									<TableCell>Georges Pipero</TableCell>
									<TableCell>geroges@gmail.com</TableCell>
									<TableCell>
										<Badge variant="default">Usuario</Badge>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>2</TableCell>
									<TableCell>Georges Pipero</TableCell>
									<TableCell>geroges@gmail.com</TableCell>
									<TableCell>
										<Badge variant="default">Usuario</Badge>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>2</TableCell>
									<TableCell>Georges Pipero</TableCell>
									<TableCell>geroges@gmail.com</TableCell>
									<TableCell>
										<Badge variant="default">Usuario</Badge>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
          <div className="flex justify-between items-center mt-6">
            <Button className='bg-blue-600 hover:bg-blue-700'>
              Primera
            </Button>
            <div className='flex space-x-4 items-center'>
              <Button variant={'ghost'} className="p-0">
                <MinusCircle size={20} />
              </Button>
              <span>
                Pagina 1 de 10
              </span>
              <Button variant={'ghost'} className="p-0">
                <CirclePlus size={20} />
              </Button>
            </div>
            <Button className='bg-blue-600 hover:bg-blue-700'>
              Ultima
            </Button>
          </div>
				</CardContent>
			</Card>
		</div>
	);
}

function PlusIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M5 12h14" />
			<path d="M12 5v14" />
		</svg>
	);
}

function SearchIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="11" cy="11" r="8" />
			<path d="m21 21-4.3-4.3" />
		</svg>
	);
}

function XIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M18 6 6 18" />
			<path d="m6 6 12 12" />
		</svg>
	);
}
