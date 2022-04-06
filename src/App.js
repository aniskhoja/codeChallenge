import { useEffect, useState, React } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { FilterMatchMode } from 'primereact/api';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Dialog } from 'primereact/dialog';

//CSS
import "primeflex/primeflex.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import './App.css';


function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState({ type: false, message: "" });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [position, setPosition] = useState('center');
  const [displayPosition, setDisplayPosition] = useState(false);
  
  const [filters2, setFilters2] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'title': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'releaseDate': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'length': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'director': { value: null, matchMode: FilterMatchMode.IN },
        'certification': { value: null, matchMode: FilterMatchMode.EQUALS },
        'rating': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  //director name for drop down
  const directorsName = [...new Set(data.map(item => item.director))];
  //certification name for drop down
  const certifications = [...new Set(data.map(item => item.certification))];
  
  const getMovieData = async () => {
    try {
      const { data } = await axios.get('https://skyit-coding-challenge.herokuapp.com/movies');
      data.map(el => el.rating = ((el.rating / 5) * 100).toFixed(2) + "%")
      setData(data)
    } catch (err) {
      setError({ type: true, message: err.message })
    }
  };

  useEffect(() => {
    getMovieData();
  }, []);
  
  //detail view 
  const dialogFuncMap = {'displayPosition': setDisplayPosition};

  const onClick = (name, position) => {
    dialogFuncMap[`${name}`](true);
    if (position) {setPosition(position);}
  };

  const onHide = (name) => {
    dialogFuncMap[`${name}`](false);
    setSelectedProduct(null)
  };


  const directorBodyTemplate = (rowData) => {
    const directorsName = rowData.director;
    return <span className="image-text">{directorsName}</span>
  };

  const directorsItemTemplate = (option) => {
    return (
      <div className="p-multiselect-director-option">
        <span className="image-text">{option}</span>
      </div>
    );
  };

  const directorRowFilterTemplate = (options) => {
    return <MultiSelect value={options.value}
      options={directorsName}
      itemTemplate={directorsItemTemplate}
      onChange={(e) => options.filterApplyCallback(e.value)}
      placeholder="ALL" className="p-column-filter" maxSelectedLabels={1} />;
  };

  //certification
  //certification dropdown body
  const statusBodyTemplate = (rowData) => {
    return <span className={`customer-badge status-${rowData.certification}`}>{rowData.certification}</span>;
  };

  const statusItemTemplate = (option) => {
    return <span className={`customer-badge status-${option}`}>{option}</span>;
  };

  //certification frop down
  const statusRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={certifications}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={statusItemTemplate}
        placeholder="Select a Status"
        className="p-column-filter"
        showClear
      />
    );
  };

  return (
    <div className='App' >
      <h1>Favorite Movie List</h1>
      {selectedProduct?.plot && (
        <Dialog className='dialog'
          header="Movie Details"
          visible={displayPosition}
          position={position} modal
          style={{ width: '40vw' }}
          footer="All movie data is from wikipedia and IMDb"
          onHide={() => onHide('displayPosition')}
          draggable={false} resizable={false}>
            <div className='detailView'>
              <h1>{selectedProduct.title}</h1>
              <h4>Directed by {selectedProduct.director}</h4>
              <h3>Cast:{ selectedProduct.cast.map((actor, index) => <span key={index}>{actor}</span>)}</h3>
              <h3>Genre:{selectedProduct.genre.map((genre, index) => <span key={index}>{genre}</span>)}</h3>
              < div><h3>Plot:</h3> <p>{ selectedProduct.plot}</p></div>
            </div>
      </Dialog>)}
      
      <DataTable
        value={data}
        selection={selectedProduct}
        onSelectionChange={e => setSelectedProduct(e.value)}
        className="dataTable"
        responsiveLayout="scroll"
        dataKey="_id"
        filters={filters2}
        filterDisplay="row"
        globalFilterFields={['title', 'releaseDate', 'director', 'certification', 'rating']}
        emptyMessage="No customers found."
        onClick={() => onClick('displayPosition', 'right')}
        paginator
        rows={10}
      >
        <Column selectionMode="single" headerStyle={{width: '3em'}}></Column>
        <Column field="title" header="Title" filter showFilterMenu={false}
            filterPlaceholder="Search by title" style={{  width: '20rem' }}></Column>
        <Column field="releaseDate"
          header="Year"
          filterField="releaseDate"
          style={{ width: '20rem' }}
          filter showFilterMenu={false}
          filterPlaceholder="Search by release year">
          </Column>
        <Column field="length"
          header="RunningTime"
          filterField="length"
          showFilterMenu={false}
          style={{ width: '20rem' }}
          filter filterPlaceholder="Search by time">
          </Column>
        <Column header="Director"
            field="director"
            filterField="director"
            showFilterMenu={false}
            style={{ width: "20rem" }}
            body={directorBodyTemplate}
            filter
            filterElement={directorRowFilterTemplate}>
        </Column>
        <Column field='certification'
          header="Certification"
          filterField='certification'
          showFilterMenu={false} style={{ width: '20rem' }}
          body={statusBodyTemplate}
          filter
          filterElement={statusRowFilterTemplate}>
          </Column>
        <Column field='rating'
          header="Rating"
          filterField="rating"
          showFilterMenu={false}
          style={{ width: '20rem' }}
          filter
          filterPlaceholder="Search by rating">
          </Column>
      </DataTable>

    </div>
  );
}

export default App;
