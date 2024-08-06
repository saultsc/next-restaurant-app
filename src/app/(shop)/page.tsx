import { ProductGrid, Title } from '@/components';
import { MesasAssign } from '@/components/mesas-assign/MesasAssign';
import { initialData } from '@/seed/seed';

const products = initialData.products;

export default function DashboardPage() {
	return (
		<div>
			<Title title="Comidas" subTitle="Todos las comidas" clssName="mb-2" />

			<MesasAssign />
		</div>
	);
}
