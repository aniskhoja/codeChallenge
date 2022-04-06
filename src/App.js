import { useEffect, useState, React } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState({ type: false, message: "" });
  const [globalFilterValue2, setGlobalFilterValue2] = useState("");
  const [loading, setLoading] = useState(true);
  const [filters2, setFilters2] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'title': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'releaseDate': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'length': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'director': { value: null, matchMode: FilterMatchMode.IN },
        'certification': { value: null, matchMode: FilterMatchMode.EQUALS },
        'rating': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const directorsName =  [...new Map(data.map(item => [item['director'], item])).values()];
  
  const getMovieData = async () => {
    try {
      const { data } = await axios.get('https://skyit-coding-challenge.herokuapp.com/movies');
      data.map(el => el.rating= ((el.rating/5)* 100).toFixed(2) + "%")
      setData(data)
    } catch (err) {
      setError({type: true, message: err.message})
    }
  }
  useEffect(() => {
    
    getMovieData();
  }, []);

const renderHeader2 = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue2}
            onChange={onGlobalFilterChange2}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
};
  const onGlobalFilterChange2 = (e) => {
    const value = e.target.value;
    let _filters2 = { ...filters2 };
    _filters2["global"].value = value;

    setFilters2(_filters2);
    setGlobalFilterValue2(value);
  };
  
 //refactor
  const representativeBodyTemplate = (rowData) => {
    const directorsName = rowData.director;
    return <span className="image-text">{directorsName}</span>
  };

  const representativesItemTemplate = (option) => {
    return (
      <div className="p-multiselect-representative-option">
        <span className="image-text">{option.director}</span>
      </div>
    );
  };

  const representativeRowFilterTemplate = (options) => {
        return <MultiSelect value={options.value} options={directorsName} itemTemplate={representativesItemTemplate}  onChange={(e) => options.filterApplyCallback(e.value)} optionLabel="director" placeholder="ALL" className="p-column-filter" maxSelectedLabels={1} />;
    }

  const statusBodyTemplate = (rowData) => {
    return <span className={`customer-badge status-${rowData.status}`}>{rowData.certification}</span>;
  };

  const statusItemTemplate = (option) => {
    return <span className={`customer-badge status-${option}`}>{option}</span>;
  };

 const statusRowFilterTemplate = (options) => {
        return <Dropdown value={options.value} options={data.certification} onChange={(e) => options.filterApplyCallback(e.value)} placeholder="Select a Status" className="p-column-filter" showClear />;
    }
  
  
  return (
    <div>
      <DataTable
        value={data}
        responsiveLayout="scroll"
        className="p-datatable-customers"
        dataKey="id"
        filters={filters2}
        filterDisplay="row"
        globalFilterFields={['title', 'releaseDate', 'director', 'certification', 'rating']}
        emptyMessage="No customers found."

      >
        <Column selectionMode="single" ></Column>
        <Column field="title" header="Title" filter showFilterMenu={false}
            filterPlaceholder="Search by title" style={{ minWidth: '12rem' }}></Column>
        <Column field="releaseDate" header="Year" filterField="releaseDate" style={{ minWidth: '12rem' }} filter showFilterMenu={false} filterPlaceholder="Search by release year"></Column>
        <Column field="length" header="RunningTime" filterField="length" showFilterMenu={false} style={{ minWidth: '12rem' }} filter filterPlaceholder="Search by movie length"></Column>
        <Column header="director"
            field="director"
            filterField="director"
            showFilterMenu={false}
            filterMenuStyle={{ width: "14rem" }}
            style={{ minWidth: "14rem" }}
            body={representativeBodyTemplate}
            filter
            filterElement={representativeRowFilterTemplate}>
        </Column>
        <Column field='certification' header="Certification" filterField='certification' showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusRowFilterTemplate}></Column>
        <Column field='rating' header="Rating" filterField="rating" showFilterMenu={false} style={{ minWidth: '12rem' }} filter filterPlaceholder="Search by movie length"></Column>
      </DataTable>

    </div>
  );
}

export default App;
