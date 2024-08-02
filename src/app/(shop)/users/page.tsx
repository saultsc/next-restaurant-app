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
import { IoAddOutline, IoSearchOutline } from 'react-icons/io5';

export default function Component() {
	return (
		<div className="p-4 mt-6">
			<div className="flex items-center justify-between space-x-4 mb-4">
				<div className="flex space-x-4">
					<Input type="search" placeholder="Usuario" />
					<Button variant="default" className="bg-blue-600 hover:bg-blue-700">
						<IoSearchOutline className="mr-2 h-4 w-4" />
						BUSCAR
					</Button>
				</div>
				<div className="flex space-x-4">
					<Button variant="default" className="ml-auto bg-green-600 hover:bg-green-700 text-white">
						<IoAddOutline size={20}  className="mr-2" />
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
										<Badge className='bg-blue-500'>Adminstrador</Badge>
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
                <MinusCircle size={20} className="hover:text-blue-400" />
              </Button>
              <span>
                Pagina 1 de 10
              </span>
              <Button variant={'ghost'} className="p-0">
								<CirclePlus size={20} className="hover:text-blue-400" />
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