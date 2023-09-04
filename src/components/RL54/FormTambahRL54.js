import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate, Link } from 'react-router-dom'
import style from './FormTambahRL54.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoArrowBack } from 'react-icons/io5'
import { Typeahead } from 'react-bootstrap-typeahead';
import Spinner from 'react-bootstrap/esm/Spinner'


const FormTambahRL54 = () => {
    const [tahun, setTahun] = useState('2022')
    const [bulan, setBulan] = useState('01')
    const [namaRS, setNamaRS] = useState('')
    const [alamatRS, setAlamatRS] = useState('')
    const [namaPropinsi, setNamaPropinsi] = useState('')
    const [namaKabKota, setNamaKabKota] = useState('')
    const [dataRL, setDataRL] = useState([])
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const [spinner, setSpinner] = useState(false)
    const [buttonStatus, setButtonStatus] = useState(false)
    const navigate = useNavigate()
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        refreshToken()
        // getDataRS()
        getRLLimaTitikEmpatTemplate()
        getIcd10()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const refreshToken = async() => {
        try {
            const response = await axios.get('/apisirs/token')
            setToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            setExpire(decoded.exp)
            getDataRS(decoded.rsId)
        } catch (error) {
            if(error.response) {
                navigate('/')
            }
        }
    }

    const axiosJWT = axios.create()
    axiosJWT.interceptors.request.use(async(config) => {
        const currentDate = new Date()
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('/apisirs/token')
            config.headers.Authorization = `Bearer ${response.data.accessToken}`
            setToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            setExpire(decoded.exp)
        }
        return config
    }, (error) => {
        return Promise.reject(error)
    })

    const getDataRS = async (id) => {
        try {
            const response = await axiosJWT.get('/apisirs/rumahsakit/' + id, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        //    console.log(response.data)
            setNamaRS(response.data.data[0].nama)
            setAlamatRS(response.data.data[0].alamat)
            setNamaPropinsi(response.data.data[0].propinsi.nama)
            setNamaKabKota(response.data.data[0].kabKota.nama)
        } catch (error) {
            
        }
    }

    const getIcd10 = async() => {
        try{
            const response = await axiosJWT.get('/apisirs/geticd10',{
                headers: {
                    Authorization : `Bearer ${token}`
                }
            })
            const rlIcd10 = response.data.data.map((value, index) => {
                let labelJumlah = value.code+"-"+ value.description
                return {
                   
                    label:labelJumlah,
                    kodeIcd10 : value.code,
                    deskripsi: value.description
                    
                }
            })
            setSelected(rlIcd10)
            // console.log(rlIcd10)
        } catch (error) {
        }
    }

    const getRLLimaTitikEmpatTemplate = async() => {
        setSpinner(true)
        try {
            const response = await axiosJWT.get('/apisirs/getnourut', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            
            const rlTemplate = response.data.data.map((value, index) => {
                return {
                    id: value.id,
                    no: value.no,
                    urut:value.nama,
                    kodeIcd10: '',
                    deskripsi: '',
                    kasusBaruLk: 0,
                    kasusBaruPr: 0,

                    jumlahKunjungan: 0,
                    disabledInput: true,
                    checked: false
                }
            })
            setDataRL(rlTemplate)
setSpinner(false)
        } catch (error) {
            
        }
    }
// console.log(dataRL);
    const changeHandlerSingle = (event) => {
        const name = event.target.name
        if (name === 'tahun') {
            setTahun(event.target.value)
        } else if (name === 'bulan') {
            setBulan(event.target.value)
        }
    }

    const handleChange = (event, index) =>{
        let newDataRL = [...dataRL]
        if(typeof event[0] !== 'undefined'){
        newDataRL[index].kodeIcd10 = event[0].kodeIcd10
        newDataRL[index].deskripsi = event[0].deskripsi
        setDataRL(newDataRL)
        }
        
    }
    
    const handleFocus = (event) => event.target.select()

    const blurHandler = (event,index) => {
        //console.log("input blurred")
        let newDataRL = [...dataRL]
        // console.log(newDataRL[index].jumlahKunjungan)
        if(parseInt(newDataRL[index].jumlahKunjungan) <  (parseInt(newDataRL[index].kasusBaruLk) + parseInt(newDataRL[index].kasusBaruPr))){
        //console.log('berhasil')
        alert('Jumlah Kunjungan tidak boleh lebih kecil dari Jumlah Kasus Baru')
        event.target.value = 0
            } else {
                newDataRL[index].jumlahKunjungan = event.target.value
            }
        
      }
    const changeHandler = (event, index) => {
        let newDataRL = [...dataRL]
        const name = event.target.name

        if (name === 'check') {
            if (event.target.checked === true) {
                newDataRL[index].disabledInput = false
                getIcd10()
            } else if (event.target.checked === false) {
                newDataRL[index].disabledInput = true
            }
            newDataRL[index].checked = event.target.checked
        } else if (name === 'no') {
            newDataRL[index].no = event.target.value
        } else if (name === 'urut') {
            newDataRL[index].urut = event.target.value
        } else if (name === 'kodeIcd10') {
            // console.log(event.target.value)
            newDataRL[index].kodeIcd10 = event.target.value
        } else if (name === 'deskripsi') {
            // console.log(event.target.value)
            newDataRL[index].deskripsi = event.target.value
        } else if (name === 'kasusBaruLk') {
            if(event.target.value === ''){
                    
                event.target.value = 0
                event.target.select(event.target.value)
                }
            newDataRL[index].kasusBaruLk = parseInt(event.target.value)
        } else if (name === 'kasusBaruPr') {
            if(event.target.value === ''){
                    
                event.target.value = 0
                event.target.select(event.target.value)
                }
            newDataRL[index].kasusBaruPr = parseInt(event.target.value)
        } else if (name === 'jumlahKunjungan') {
            if(event.target.value === ''){
                    
                event.target.value = 0
                event.target.select(event.target.value)
                }
                newDataRL[index].jumlahKunjungan = parseInt(event.target.value)
        } 
        setDataRL(newDataRL)
    }

    const Simpan = async (e) => {
        let date = (tahun+'-'+bulan+'-01');
        setSpinner(true)
        setButtonStatus(true)
        e.preventDefault()
        try {
           
            const dataRLArray = dataRL.filter((value) => {
                return value.checked === true
            }).map((value, index) => {
                let jumlahKasusBaru = parseInt(value.kasusBaruLk) + parseInt(value.kasusBaruPr)
                console.log(value)
                return {

                "noUrutId": value.id,
                "kodeIcd10": value.kodeIcd10,
                "deskripsi": value.deskripsi,
                "kasusBaruLk": parseInt(value.kasusBaruLk),
                "kasusBaruPr": parseInt(value.kasusBaruPr),
                "jumlahKasusBaru": jumlahKasusBaru,
                "jumlahKunjungan": parseInt(value.jumlahKunjungan)
                }
            })
            const customConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
            await axiosJWT.post('/apisirs/rllimatitikempat',{
                tahun: parseInt(tahun),
                tahunDanBulan : date,
                data: dataRLArray
            }, customConfig)
            setSpinner(false)
            toast('Data Berhasil Disimpan', {
                position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => {
                navigate('/rl54')
            }, 1000);
        } catch (error) {
            toast(`Data tidak bisa disimpan karena ,${error.response.data.message}`, {
                position: toast.POSITION.TOP_RIGHT
            })
            setSpinner(false)
            setButtonStatus(false)
        }
    }

    const maxLengthCheck = (object) => {
        if (object.target.value.length > object.target.maxLength) {
          object.target.value = object.target.value.slice(0, object.target.maxLength)
        }
      }

    return (
        <div className="container" style={{marginTop: "70px"}}>
            <form onSubmit={Simpan}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title h5">Profile Fasyankes</h5>
                                <div className="form-floating" style={{width:"100%", display:"inline-block"}}>
                                    <input type="text" className="form-control" id="floatingInput"
                                        value={ namaRS } disabled={true}/>
                                    <label htmlFor="floatingInput">Nama</label>
                                </div>
                                <div className="form-floating" style={{width:"100%", display:"inline-block"}}>
                                    <input type="text" className="form-control" id="floatingInput"
                                        value={ alamatRS} disabled={true}/>
                                    <label htmlFor="floatingInput">Alamat</label>
                                </div>
                                <div className="form-floating" style={{width:"50%", display:"inline-block"}}>
                                    <input type="text" className="form-control" id="floatingInput"
                                        value={ namaPropinsi } disabled={true}/>
                                    <label htmlFor="floatingInput">Provinsi </label>
                                </div>
                                <div className="form-floating" style={{width:"50%", display:"inline-block"}}>
                                    <input type="text" className="form-control" id="floatingInput"
                                        value={ namaKabKota } disabled={true}/>
                                    <label htmlFor="floatingInput">Kab/Kota</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title h5">Periode Laporan</h5>
                                    <div className="form-floating" style={{width:"100%", display:"inline-block"}}>
                                        <select name="tahun" className="form-control" id="tahun" onChange={e => changeHandlerSingle(e)}>
                                            <option value="2022">2022</option>
                                            <option value="2023">2023</option>
                                        </select>
                                        <label htmlFor="tahun">Tahun</label>
                                    </div>
                                    <div className="form-floating" style={{width:"100%", display:"inline-block"}}>
                                        <select name="bulan" className="form-control" id="bulan" onChange={e => changeHandlerSingle(e)}>
                                            <option value="01">Januari</option>
                                            <option value="02">Februari</option>
                                            <option value="03">Maret</option>
                                            <option value="04">April</option>
                                            <option value="05">Mei</option>
                                            <option value="06">Juni</option>
                                            <option value="07">Juli</option>
                                            <option value="08">Agustus</option>
                                            <option value="09">September</option>
                                            <option value="10">Oktober</option>
                                            <option value="11">November</option>
                                            <option value="12">Desember</option>
                                        </select>
                                        <label htmlFor="bulan">Bulan</label>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                    
                        <Link to={`/rl54/`} className='btn btn-info' style={{fontSize:"18px", backgroundColor: "#779D9E", color: "#FFFFFF"}}>
                            {/* <IoArrowBack size={30} style={{color:"gray",cursor: "pointer"}}/><span style={{color: "gray"}}></span> */}
                            &lt;
                            </Link>
                            <span style={{color: "gray"}}>RL 5.4 10 Besar Penyakit Rawat Jalan</span>
                        
                        <div className="container" style={{ textAlign: "center" }}>
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                        </div>
                        <table className={style.rlTable}>
                            <thead>
                                <tr>
                                    <th style={{"width": "6%"}}>No.</th>
                                    <th style={{"width": "2%"}}></th>
                                    <th style={{"width": "6%"}}>No Urut</th>
                                    <th>KODE ICD 10</th>
                                    <th>Kasus Baru menurut Jenis Kelamin LK</th>
                                    <th>Kasus Baru menurut Jenis Kelamin PR</th>
                                    <th>Jumlah Kunjungan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataRL.map((value, index) => {
                                    return (
                                        <tr key={value.id}>
                                            <td>
                                                {value.id}
                                            </td>
                                            <td style={{textAlign: "center", verticalAlign: "middle"}}>
                                                <input type="checkbox" name='check' className="form-check-input" onChange={e => changeHandler(e, index)} checked={value.checked}/>
                                            </td>
                                            <td>
                                                {value.urut}
                                            </td>
                                            <td>
                                                <Typeahead
                                                id="kodeIcd10"
                                                labelKey="kodeIcd10"
                                                nameClass="kodeIcd10"
                                                onChange={e => handleChange (e, index)}
                                                options={selected}
                                                placeholder="Choose a state..."
                                                selected={value.selected}
                                               disabled={value.disabledInput}
                                              />
                                            </td>
                                            <td><input type="number" min={0} maxLength={7}
                                                onInput={(e) => maxLengthCheck(e)} name="kasusBaruLk" className="form-control" value={parseInt(value.kasusBaruLk)} 
                                                onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} />
                                            </td>
                                            <td><input type="number" min={0} maxLength={7}
                                                onInput={(e) => maxLengthCheck(e)} name="kasusBaruPr" className="form-control" value={parseInt(value.kasusBaruPr)} 
                                                onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} />
                                            </td>
                                            <td><input type="number" min={0} maxLength={7}
                                                onInput={(e) => maxLengthCheck(e)} name="jumlahKunjungan" className="form-control" value={parseInt(value.jumlahKunjungan)} 
                                                onFocus={handleFocus} onChange={e => changeHandler(e, index)} onBlur={e => blurHandler (e, index)} disabled={value.disabledInput} />
                                            </td>
                                        </tr>
                                    )
                                }) }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-3 mb-3">
                <ToastContainer />
                    <button type="submit" className="btn btn-outline-success" disabled={buttonStatus}><HiSaveAs/> Simpan</button>
                </div>
            </form>
        </div>
        
    )
}

export default FormTambahRL54