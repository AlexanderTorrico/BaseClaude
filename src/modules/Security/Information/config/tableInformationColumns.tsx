import { InformationModel } from '../models/InformationModel';

export const informationColumns = [
  {
    Header: 'ID',
    accessor: 'id',
    filterable: true,
  },
  {
    Header: 'Acciones',
    accessor: 'actions',
    disableFilters: true,
    Cell: ({ row }: any) => {
      const item: InformationModel = row.original;

      return (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => console.log('Editar:', item.id)}
          >
            <i className="mdi mdi-pencil"></i>
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => console.log('Eliminar:', item.id)}
          >
            <i className="mdi mdi-delete"></i>
          </button>
        </div>
      );
    },
  },
];
