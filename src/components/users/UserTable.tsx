interface Props {
	columns: Column[];
	rows: Row[];
}

interface Row {
	name: string;
	[key: string]: any;
}

export interface Column {
	name: string;
	label: string;
	side?: 'left' | 'right' | 'center';
	action?: string[];
}

export const UserTable = ({ rows, columns }: Props) => {
	return (
		<table className="w-full bg-white shadow-md rounded-xl">
			<thead>
				<tr className="bg-blue-gray-100 text-gray-700">
					{columns.map((column) => (
						<th className={`py-3 px-4 text-${column.side || 'left'}`} key={column.name}>
							{column.label}
						</th>
					))}
				</tr>
			</thead>
			<tbody className="text-blue-gray-900">
				{rows.map((row) => (
					<tr className="border-b border-blue-gray-200" key={row.name}>
						{columns.map((column) => (
							<td
								className={`py-3 px-4 text-${column.side || 'left'}`}
								key={column.name}
							>
								{row[column.name]}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
};
