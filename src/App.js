import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { RadioButton } from 'primereact/radiobutton';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState({ type: false, message: "" });
  const [loading, setLoading] = useState("false");

  const getMovieData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('https://skyit-coding-challenge.herokuapp.com/movies');
      setLoading(false);
      data.map(el => el.rating= ((el.rating/5)* 100).toFixed(2) + "%")
      setData(data)
    } catch (err) {
      setError({type: true, message: err.message})
      setLoading(false)
    }
  }
  useEffect(() => {
    getMovieData();
  }, []);

  // const dynamicColumns = data.map((movie,i) => {
  //       return <movie key={movie._id} field={movie.field} header={movie.title} />;
  //   });
  
  return (
    <div>
      <DataTable
        value={data}
        responsiveLayout="scroll"
        dataKey="_id"
      >
        {/* <RadioButton value="val1" name="city"  /> */}
        <Column selectionMode="single" headerStyle={{ width: '3rem' }} exportable={false}></Column>
        <Column field="title" header="Title"></Column>
        <Column field='releaseDate' header="Year"></Column>
        <Column field='length' header="RunningTime"></Column>
        <Column field='director' header="Director"></Column>
        <Column field='certification' header="Certification"></Column>
        <Column field='rating' header="Rating"></Column>
      </DataTable>

    </div>
  );
}

export default App;
