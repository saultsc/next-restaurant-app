import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';

import { IoCardOutline } from 'react-icons/io5';
import { QuantitySelector, Title } from '@/components';

import { initialData } from '@/seed/seed';

const productsInCart = [initialData.products[0], initialData.products[1], initialData.products[2]];

interface Props {
	params: {
		id: string;
	};
}

export default function ProductIdPage({ params }: Props) {
	const { id } = params;

	return (
		<div className="flex justify-center items-center mb-72 px-10 sm:px-0">
			<div className="flex flex-col w-[1000px]">
				<Title title={`Ornden #${id}`} />

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
					{/* Carrito */}
					<div className="flex flex-col mt-5">
						<div
							className={clsx(
								'flex items-center rounded py-2 px-2.5 text-xs font-bold text-white mb-5',
								{
									'bg-red-500': false,
									'bg-green-700': true,
								}
							)}
						>
							<IoCardOutline size={25} />
							{/* <span className="mx-2">Pendiente de pago</span> */}
							<span className="mx-2">Pagada</span>
						</div>

						{/* Items */}
						{productsInCart.map((product) => (
							<div key={product.slug} className="flex mb-5">
								<Image
									src={`/products/${product.images[0]}`}
									alt={`Foto del producto ${product.title}`}
									width={100}
									height={100}
									style={{
										width: '100px',
										height: '100px',
									}}
									className="mr-5 rounded"
								/>

								<div>
									<p>{product.title}</p>
									<p>${product.price} x 3</p>
									<p className="font-bold"> Subtotal: ${product.price * 3}</p>
								</div>
							</div>
						))}
					</div>

					{/* Checkout */}
					<div className="bg-white rounded-xl shadow-xl p-7">
						<h2 className="text-2xl mb-2">Dirreccion de entrega</h2>
						<div className="mb-10">
							<p>Carlos Saul Padilla</p>
							<p>Av. Siempre Viva 123</p>
							<p>Col. Centro</p>
							<p>Alcaldia Cuauhtemoc</p>
							<p>Fuente Alvilla</p>
							<p>123.123.123</p>
						</div>

						{/* Divider */}
						<div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

						<h2 className="text-2xl mb-2">Resumen de orden</h2>

						<div className="grid grid-cols-2">
							<span>No. Productos</span>
							<span className="text-right">3 Articulos</span>

							<span>Subtotal</span>
							<span className="text-right">$ 100</span>

							<span>Impuestos (15%)</span>
							<span className="text-right">$ 100</span>

							<span className="mt-5 text-2xl">Total:</span>
							<span className="mt-5 text-2xl text-right">$ 100</span>
						</div>

						<div className="mt-5 mb-2 w-full">
							<div
								className={clsx(
									'flex items-center rounded py-2 px-2.5 text-xs font-bold text-white mb-5',
									{
										'bg-red-500': true,
										'bg-green-700': false,
									}
								)}
							>
								<IoCardOutline size={25} />
								<span className="mx-2">Pendiente de pago</span>
								{/* <span className="mx-2">Pagada</span> */}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
