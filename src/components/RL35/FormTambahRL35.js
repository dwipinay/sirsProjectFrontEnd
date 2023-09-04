import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate, Link } from 'react-router-dom'
import style from './FormTambahRL35.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { IoArrowBack } from 'react-icons/io5'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Table from 'react-bootstrap/Table'
import Spinner from 'react-bootstrap/Spinner'

const FormTambahRL35 = () => {
    const [tahun, setTahun] = useState('')
    const [namaRS, setNamaRS] = useState('')
    const [alamatRS, setAlamatRS] = useState('')
    const [namaPropinsi, setNamaPropinsi] = useState('')
    const [namaKabKota, setNamaKabKota] = useState('')
    const [dataRL, setDataRL] = useState([])
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const navigate = useNavigate()
    const [buttonStatus, setButtonStatus] = useState(false)
    const [spinner, setSpinner]= useState(false)

    useEffect(() => {
        refreshToken()
        getRLTigaTitikLimaTemplate()
        const date = new Date();
        setTahun(date.getFullYear() - 1)

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
            setNamaRS(response.data.data[0].nama)
            setAlamatRS(response.data.data[0].alamat)
            setNamaPropinsi(response.data.data[0].propinsi.nama)
            setNamaKabKota(response.data.data[0].kabKota.nama)
        } catch (error) {
            
        }
    }

    const getRLTigaTitikLimaTemplate = async() => {
        setSpinner(true)
        try {
            const response = await axiosJWT.get('/apisirs/jeniskegiatan?rlid=5', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            
            const rlTemplate = response.data.data.map((value, index) => {
                return {
                    id: value.id,
                    no: value.no,
                    jenisKegiatan: value.nama,
                    rmRumahSakit: 0,
                    rmBidan: 0,
                    rmPuskesmas: 0,
                    rmFaskesLainnya: 0,
                    rmMati: 0,
                    rmTotal: 0,
                    rnmMati: 0,
                    rnmTotal: 0,
                    nrMati: 0,
                    nrTotal: 0,
                    dirujuk: 0,
                    disabledInput: true,
                    checked: false
                }
            })
            setDataRL(rlTemplate)
            setSpinner(false)
        } catch (error) {
            
        }
    }

    const changeHandlerSingle = (event) => {
        setTahun(parseInt(event.target.value))
    }

    const changeHandler = (event, index) => {
        let newDataRL = [...dataRL]
        const name = event.target.name
        if (name === 'check') {
            if (event.target.checked === true) {
                newDataRL[index].disabledInput = false
            } else if (event.target.checked === false) {
                newDataRL[index].disabledInput = true
            }
            newDataRL[index].checked = event.target.checked
        } else if (name === 'rmRumahSakit') {
            if(event.target.value === ''){
                    
                event.target.value = 0
                event.target.select(event.target.value)
                }
            newDataRL[index].rmRumahSakit = parseInt(event.target.value)
            newDataRL[index].rmTotal = parseInt(event.target.value) + parseInt(dataRL[index].rmBidan) + parseInt(dataRL[index].rmPuskesmas) + parseInt(dataRL[index].rmFaskesLainnya)
        } else if (name === 'rmBidan') {
            if(event.target.value === ''){
                    
                event.target.value = 0
                event.target.select(event.target.value)
                }
            newDataRL[index].rmBidan = parseInt(event.target.value)
            newDataRL[index].rmTotal = parseInt(event.target.value) + parseInt(dataRL[index].rmRumahSakit) + parseInt(dataRL[index].rmPuskesmas) + parseInt(dataRL[index].rmFaskesLainnya)
        } else if (name === 'rmPuskesmas') {
            if(event.target.value === ''){
                    
                event.target.value = 0
                event.target.select(event.target.value)
                }
            newDataRL[index].rmPuskesmas = parseInt(event.target.value)
            newDataRL[index].rmTotal = parseInt(event.target.value) + parseInt(dataRL[index].rmBidan) + parseInt(dataRL[index].rmRumahSakit) + parseInt(dataRL[index].rmFaskesLainnya)
        } else if (name === 'rmFaskesLainnya') {
            if(event.target.value === ''){
                    
                event.target.value = 0
                event.target.select(event.target.value)
                }
            newDataRL[index].rmFaskesLainnya = parseInt(event.target.value)
            newDataRL[index].rmTotal = parseInt(event.target.value) + parseInt(dataRL[index].rmBidan) + parseInt(dataRL[index].rmPuskesmas) + parseInt(dataRL[index].rmRumahSakit)
        } else if (name === 'rmMati') {
            if(event.target.value === ''){
                    
                event.target.value = 0
                event.target.select(event.target.value)
                }

            // newDataRL[index].rmMati = parseInt(event.target.value)
            if(parseInt(event.target.value) >   parseInt(dataRL[index].rmTotal)){
                alert('RM Mati tidak boleh lebih besar dari RM Total')
                newDataRL[index].rmMati = 0
            } else {
                newDataRL[index].rmMati = parseInt(event.target.value)
            }
        } else if (name === 'rmTotal') {
            if(event.target.value === ''){
                    
                event.target.value = 0
                event.target.select(event.target.value)
                }

            if(parseInt(event.target.value) >   parseInt(dataRL[index].rmMati)){
                // alert('RM Mati tidak boleh lebih besar dari RM Total')
                newDataRL[index].rmTotal = parseInt(event.target.value)
            } else {
                newDataRL[index].rmTotal = parseInt(dataRL[index].rmMati)
            }
        } else if (name === 'rnmMati') {
            if(event.target.value === ''){
                    
                event.target.value = 0
                event.target.select(event.target.value)
                }
            // newDataRL[index].rnmMati = parseInt(event.target.value)
            if(parseInt(event.target.value) >   parseInt(dataRL[index].rnmTotal)){
                // alert('RNM Mati tidak boleh lebih besar dari RNM Total')
                // newDataRL[index].rnmMati = 0
                newDataRL[index].rnmTotal = parseInt(event.target.value)
                newDataRL[index].rnmMati = parseInt(event.target.value)
            } else {
                newDataRL[index].rnmMati = parseInt(event.target.value)
            }
        } else if (name === 'rnmTotal') {
            if(event.target.value === ''){
                    
                event.target.value = 0
                event.target.select(event.target.value)
                }

            if(parseInt(event.target.value) >   parseInt(dataRL[index].rnmMati)){
                    // alert('RM Mati tidak boleh lebih besar dari RM Total')
                    newDataRL[index].rnmTotal = parseInt(event.target.value)
                } else {
                    newDataRL[index].rnmTotal = parseInt(dataRL[index].rnmMati)
                }
            
        } else if (name === 'nrMati') {
            if(event.target.value === ''){
                    
                event.target.value = 0
                event.target.select(event.target.value)
                }
            // newDataRL[index].nrMati = parseInt(event.target.value)
            if(parseInt(event.target.value) >   parseInt(dataRL[index].nrTotal)){
                // alert('NR Mati tidak boleh lebih besar dari NR Total')
                // newDataRL[index].nrMati = 0

                newDataRL[index].nrTotal = parseInt(event.target.value)
                newDataRL[index].nrMati = parseInt(event.target.value)
            } else {
                newDataRL[index].nrMati = parseInt(event.target.value)
            }
        } else if (name === 'nrTotal') {
            if(event.target.value === ''){
                    
                event.target.value = 0
                event.target.select(event.target.value)
                }

            if(parseInt(event.target.value) >   parseInt(dataRL[index].nrMati)){
                    // alert('RM Mati tidak boleh lebih besar dari RM Total')
                    newDataRL[index].nrTotal = parseInt(event.target.value)
                } else {
                    newDataRL[index].nrTotal = parseInt(dataRL[index].nrMati)
                }
            
        } else if (name === 'dirujuk') {
            if(event.target.value === ''){
                    
                event.target.value = 0
                event.target.select(event.target.value)
                }
            // newDataRL[index].dirujuk = parseInt(event.target.value)

            if(parseInt(event.target.value) >  (parseInt(dataRL[index].rmTotal) + parseInt(dataRL[index].rnmTotal) + parseInt(dataRL[index].nrTotal))){
                alert('Total Dirujuk tidak boleh lebih besar dari RM Total + RNM Total + NR TOTAL')
                newDataRL[index].dirujuk = 0
            } else {
                newDataRL[index].dirujuk = parseInt(event.target.value)
            }
        }
        
        setDataRL(newDataRL)

        let jumlahDataRL = [...dataRL]

        if (index === 1 || index === 2 ){
            jumlahDataRL[0].rmRumahSakit = (
                parseInt(dataRL[1].rmRumahSakit) +
                parseInt(dataRL[2].rmRumahSakit) 
                )
            jumlahDataRL[0].rmBidan = (
                parseInt(dataRL[1].rmBidan) +
                parseInt(dataRL[2].rmBidan) 
            )
            jumlahDataRL[0].rmPuskesmas = (
                parseInt(dataRL[1].rmPuskesmas) +
                parseInt(dataRL[2].rmPuskesmas) 
            )
            jumlahDataRL[0].rmFaskesLainnya = (
                parseInt(dataRL[1].rmFaskesLainnya) +
                parseInt(dataRL[2].rmFaskesLainnya) 
            )
            jumlahDataRL[0].rmMati = (
                parseInt(dataRL[1].rmMati) +
                parseInt(dataRL[2].rmMati) 
            )
            jumlahDataRL[0].rmTotal = (
                parseInt(dataRL[1].rmTotal) +
                parseInt(dataRL[2].rmTotal) 
            )
            jumlahDataRL[0].rnmMati = (
                parseInt(dataRL[1].rnmMati) +
                parseInt(dataRL[2].rnmMati) 
            )
            jumlahDataRL[0].rnmTotal = (
                parseInt(dataRL[1].rnmTotal) +
                parseInt(dataRL[2].rnmTotal) 
            )
            jumlahDataRL[0].nrMati = (
                parseInt(dataRL[1].nrMati) +
                parseInt(dataRL[2].nrMati) 
            )
            jumlahDataRL[0].nrTotal = (
                parseInt(dataRL[1].nrTotal) +
                parseInt(dataRL[2].nrTotal) 
            )
            jumlahDataRL[0].dirujuk = (
                parseInt(dataRL[1].dirujuk) +
                parseInt(dataRL[2].dirujuk) 
            )
            // jumlahDataRL[2].checked = false
            setDataRL(jumlahDataRL)
        } else if (index === 4 || index === 5 ){
            jumlahDataRL[3].rmRumahSakit = (
                parseInt(dataRL[4].rmRumahSakit) +
                parseInt(dataRL[5].rmRumahSakit) 
                )
            jumlahDataRL[3].rmBidan = (
                parseInt(dataRL[4].rmBidan) +
                parseInt(dataRL[5].rmBidan) 
            )
            jumlahDataRL[3].rmPuskesmas = (
                parseInt(dataRL[4].rmPuskesmas) +
                parseInt(dataRL[5].rmPuskesmas) 
            )
            jumlahDataRL[3].rmFaskesLainnya = (
                parseInt(dataRL[4].rmFaskesLainnya) +
                parseInt(dataRL[5].rmFaskesLainnya) 
            )
            jumlahDataRL[3].rmMati = (
                parseInt(dataRL[4].rmMati) +
                parseInt(dataRL[5].rmMati) 
            )
            jumlahDataRL[3].rmTotal = (
                parseInt(dataRL[4].rmTotal) +
                parseInt(dataRL[5].rmTotal) 
            )
            jumlahDataRL[3].rnmMati = (
                parseInt(dataRL[4].rnmMati) +
                parseInt(dataRL[5].rnmMati) 
            )
            jumlahDataRL[3].rnmTotal = (
                parseInt(dataRL[4].rnmTotal) +
                parseInt(dataRL[5].rnmTotal) 
            )
            jumlahDataRL[3].nrMati = (
                parseInt(dataRL[4].nrMati) +
                parseInt(dataRL[5].nrMati) 
            )
            jumlahDataRL[3].nrTotal = (
                parseInt(dataRL[4].nrTotal) +
                parseInt(dataRL[5].nrTotal) 
            )
            jumlahDataRL[3].dirujuk = (
                parseInt(dataRL[4].dirujuk) +
                parseInt(dataRL[5].dirujuk) 
            )
            // jumlahDataRL[2].checked = false
            setDataRL(jumlahDataRL)
        } else if (index === 7 || index === 8 || index === 9 || index === 10 || index === 11 || index === 12 || index === 13 || index === 14 ){
            jumlahDataRL[6].rmRumahSakit = (
                parseInt(dataRL[7].rmRumahSakit) +
                parseInt(dataRL[8].rmRumahSakit) +
                parseInt(dataRL[9].rmRumahSakit) +
                parseInt(dataRL[10].rmRumahSakit) +
                parseInt(dataRL[11].rmRumahSakit) +
                parseInt(dataRL[12].rmRumahSakit) +
                parseInt(dataRL[13].rmRumahSakit) +
                parseInt(dataRL[14].rmRumahSakit) 
                )
            jumlahDataRL[6].rmBidan = (
                parseInt(dataRL[7].rmBidan) +
                parseInt(dataRL[8].rmBidan) +
                parseInt(dataRL[9].rmBidan) +
                parseInt(dataRL[10].rmBidan) +
                parseInt(dataRL[11].rmBidan) +
                parseInt(dataRL[12].rmBidan) +
                parseInt(dataRL[13].rmBidan) +
                parseInt(dataRL[14].rmBidan) 
            )
            jumlahDataRL[6].rmPuskesmas = (
                parseInt(dataRL[7].rmPuskesmas) +
                parseInt(dataRL[8].rmPuskesmas) +
                parseInt(dataRL[9].rmPuskesmas) +
                parseInt(dataRL[10].rmPuskesmas) +
                parseInt(dataRL[11].rmPuskesmas) +
                parseInt(dataRL[12].rmPuskesmas) +
                parseInt(dataRL[13].rmPuskesmas) +
                parseInt(dataRL[14].rmPuskesmas) 
            )
            jumlahDataRL[6].rmFaskesLainnya = (
                parseInt(dataRL[7].rmFaskesLainnya) +
                parseInt(dataRL[8].rmFaskesLainnya) +
                parseInt(dataRL[9].rmFaskesLainnya) +
                parseInt(dataRL[10].rmFaskesLainnya) +
                parseInt(dataRL[11].rmFaskesLainnya) +
                parseInt(dataRL[12].rmFaskesLainnya) +
                parseInt(dataRL[13].rmFaskesLainnya) +
                parseInt(dataRL[14].rmFaskesLainnya) 
            )
            jumlahDataRL[6].rmMati = (
                parseInt(dataRL[7].rmMati) +
                parseInt(dataRL[8].rmMati) +
                parseInt(dataRL[9].rmMati) +
                parseInt(dataRL[10].rmMati) +
                parseInt(dataRL[11].rmMati) +
                parseInt(dataRL[12].rmMati) +
                parseInt(dataRL[13].rmMati) +
                parseInt(dataRL[14].rmMati) 
            )
            jumlahDataRL[6].rmTotal = (
                parseInt(dataRL[7].rmTotal) +
                parseInt(dataRL[8].rmTotal) +
                parseInt(dataRL[9].rmTotal) +
                parseInt(dataRL[10].rmTotal) +
                parseInt(dataRL[11].rmTotal) +
                parseInt(dataRL[12].rmTotal) +
                parseInt(dataRL[13].rmTotal) +
                parseInt(dataRL[14].rmTotal) 
            )
            jumlahDataRL[6].rnmMati = (
                parseInt(dataRL[7].rnmMati) +
                parseInt(dataRL[8].rnmMati) +
                parseInt(dataRL[9].rnmMati) +
                parseInt(dataRL[10].rnmMati) +
                parseInt(dataRL[11].rnmMati) +
                parseInt(dataRL[12].rnmMati) +
                parseInt(dataRL[13].rnmMati) +
                parseInt(dataRL[14].rnmMati) 
            )
            jumlahDataRL[6].rnmTotal = (
                parseInt(dataRL[7].rnmTotal) +
                parseInt(dataRL[8].rnmTotal) +
                parseInt(dataRL[9].rnmTotal) +
                parseInt(dataRL[10].rnmTotal) +
                parseInt(dataRL[11].rnmTotal) +
                parseInt(dataRL[12].rnmTotal) +
                parseInt(dataRL[13].rnmTotal) +
                parseInt(dataRL[14].rnmTotal) 
            )
            jumlahDataRL[6].nrMati = (
                parseInt(dataRL[7].nrMati) +
                parseInt(dataRL[8].nrMati) +
                parseInt(dataRL[9].nrMati) +
                parseInt(dataRL[10].nrMati) +
                parseInt(dataRL[11].nrMati) +
                parseInt(dataRL[12].nrMati) +
                parseInt(dataRL[13].nrMati) +
                parseInt(dataRL[14].nrMati) 
            )
            jumlahDataRL[6].nrTotal = (
                parseInt(dataRL[7].nrTotal) +
                parseInt(dataRL[8].nrTotal) +
                parseInt(dataRL[9].nrTotal) +
                parseInt(dataRL[10].nrTotal) +
                parseInt(dataRL[11].nrTotal) +
                parseInt(dataRL[12].nrTotal) +
                parseInt(dataRL[13].nrTotal) +
                parseInt(dataRL[14].nrTotal) 
            )
            jumlahDataRL[6].dirujuk = (
                parseInt(dataRL[7].dirujuk) +
                parseInt(dataRL[8].dirujuk) +
                parseInt(dataRL[9].dirujuk) +
                parseInt(dataRL[10].dirujuk) +
                parseInt(dataRL[11].dirujuk) +
                parseInt(dataRL[12].dirujuk) +
                parseInt(dataRL[13].dirujuk) +
                parseInt(dataRL[14].dirujuk) 
            )
            // jumlahDataRL[2].checked = false
            setDataRL(jumlahDataRL)
        }
    }

    const Simpan = async (e) => {
        e.preventDefault()
        setSpinner(true)
        setButtonStatus(true)
        try {
            const dataRLArray = dataRL.filter((value) => {
                return value.checked === true
            }).map((value, index) => {
                return {
                    "jenisKegiatanId": value.id,
                    "rmRumahSakit": value.rmRumahSakit,
                    "rmBidan": value.rmBidan,
                    "rmPuskesmas": value.rmPuskesmas,
                    "rmFaskesLainnya": value.rmFaskesLainnya,
                    "rmHidup": value.rmHidup,
                    "rmMati": value.rmMati,
                    "rmTotal": value.rmTotal,
                    "rnmHidup": value.rnmHidup,
                    "rnmMati": value.rnmMati,
                    "rnmTotal": value.rnmTotal,
                    "nrHidup": value.nrHidup,
                    "nrMati": value.nrMati,
                    "nrTotal": value.nrTotal,
                    "dirujuk": value.dirujuk
                }
            })

            const customConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
            const result = await axiosJWT.post('/apisirs/rltigatitiklima',{
                tahun: parseInt(tahun),
                data: dataRLArray
            }, customConfig)
            console.log(result.data)
            setSpinner(false)
            toast('Data Berhasil Disimpan', {
                position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => {
                navigate('/rl35')
            }, 1000);
        } catch (error) {
            console.log(error)
            toast('Data Gagal Disimpan', {
                position: toast.POSITION.TOP_RIGHT
            })
            setButtonStatus(false)
            setSpinner(false)
        }
    }

    const preventPasteNegative= (e) => {
        const clipboardData = e.clipboardData || window.clipboardData;
        const pastedData = parseFloat(clipboardData.getData('text'));

        if(pastedData <0){
            e.preventDefault();
        }
    }

    const preventMinus = (e) => {
        if(e.code === 'Minus'){
            e.preventDefault();
        }
    }

    const handleFocus = ((event) => {
        event.target.select()
    })

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
                                        value= { namaKabKota } disabled={true}/>
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
                                    <input name="tahun" type="text" className="form-control" id="floatingInput" 
                                        placeholder="Tahun" value={tahun} onChange={e => changeHandlerSingle(e)} disabled={true}/>
                                    <label htmlFor="floatingInput">Tahun</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        <Link to={`/rl35/`} className='btn btn-info' style={{fontSize:"18px", backgroundColor: "#779D9E", color: "#FFFFFF"}}>
                            {/* <IoArrowBack size={30} style={{color:"gray",cursor: "pointer"}}/><span style={{color: "gray"}}></span>
                            <span style={{color:"gray"}}>Tambah data RL 3.5 -  Perinatologi</span> */}
                            &lt;
                        </Link> 
                        <span style={{color:"gray"}}>Kembali RL 3.5 -  Perinatologi</span>
                        <div className="container" style={{ textAlign: "center" }}>
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                        </div>
                        <Table
                            className={style.rlTable}
                            striped
                            bordered
                            responsive
                            style={{ width: "200%" }}
                        >
                            <thead>
                                <tr>
                                    <th style={{"width": "2.5%"}}>No.</th>
                                    <th ></th>
                                    <th style={{"width": "10%"}}>Jenis Kegiatan</th>
                                    <th >Rujukan Medis Rumah Sakit</th>
                                    <th >Rujukan Medis Bidan</th>
                                    <th >Rujukan Medis Puskesmas</th>
                                    <th >Rujukan Medis Faskes Lainnya</th>
                                    <th >Rujukan Medis Mati</th>
                                    <th >Rujukan Medis Total</th>
                                    <th >Rujukan Non Medis Mati</th>
                                    <th >Rujukan Non Medis Total</th>
                                    <th >Non Rujukan Mati</th>
                                    <th >Non Rujukan Total</th>
                                    <th >Dirujuk</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataRL.map((value, index) => {
                                    let disabled = true
                                    let visibled = true
                                    let disabledDirujuk = true
                                    if(value.no == 1 || value.no == 2 || value.no == 3){
                                        disabled = true
                                        visibled = "none" 
                                    } else {
                                        disabled = false
                                        visibled = "block"
                                    }

                                    if(value.no == '1.1' || value.no == '1.2'){
                                        if(value.checked == false){
                                            disabledDirujuk = true
                                        } else {
                                            disabledDirujuk = false
                                        }
                                    }else if (value.no == '0'){
                                        value.disabledInput = true
                                        disabledDirujuk = true
                                    } else {
                                        disabledDirujuk = true
                                    }
                                    return (
                                        <tr key={value.id}>
                                            <td>
                                                <input type='hidden' name='id' className="form-control" value={value.id} disabled={true}/>
                                                <input type='text' name='no' className="form-control" value={value.no} disabled={true}/>
                                            </td>
                                            <td style={{textAlign: "center", verticalAlign: "middle"}}>
                                                <input type="checkbox" name='check' className="form-check-input" onChange={e => changeHandler(e, index)} checked={value.checked} disabled={disabled} style={{display: visibled}}/>
                                            </td>
                                            <td>
                                                <input type="text" name="jenisKegiatan" className="form-control" value={value.jenisKegiatan} disabled={true} />
                                            </td>
                                            <td>
                                                <input type="number" min="0" onFocus={handleFocus} maxLength={7} onInput={(e) => maxLengthCheck(e)}name="rmRumahSakit" className="form-control" value={value.rmRumahSakit} 
                                                        onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onPaste={preventPasteNegative} onKeyPress={preventMinus} />
                                            </td>
                                            <td>
                                                <input type="number" min="0" onFocus={handleFocus} maxLength={7} onInput={(e) => maxLengthCheck(e)}name="rmBidan" className="form-control" value={value.rmBidan} 
                                                        onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onPaste={preventPasteNegative} onKeyPress={preventMinus} />
                                            </td>
                                            <td>
                                                <input type="number" min="0" onFocus={handleFocus} maxLength={7} onInput={(e) => maxLengthCheck(e)}name="rmPuskesmas" className="form-control" value={value.rmPuskesmas} 
                                                        onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onPaste={preventPasteNegative} onKeyPress={preventMinus} />
                                            </td>
                                            <td>
                                                <input type="number" min="0" onFocus={handleFocus} maxLength={7} onInput={(e) => maxLengthCheck(e)}name="rmFaskesLainnya" className="form-control" value={value.rmFaskesLainnya} 
                                                        onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onPaste={preventPasteNegative} onKeyPress={preventMinus} />
                                            </td>
                                            <td>
                                                <input type="number" min="0" onFocus={handleFocus} maxLength={7} onInput={(e) => maxLengthCheck(e)}name="rmMati" className="form-control" value={value.rmMati} 
                                                        onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onPaste={preventPasteNegative} onKeyPress={preventMinus} />
                                            </td>
                                            <td>
                                                <input type="number" min="0" onFocus={handleFocus} maxLength={7} onInput={(e) => maxLengthCheck(e)}name="rmTotal" className="form-control" value={value.rmTotal} 
                                                        onChange={e => changeHandler(e, index)} disabled={true} onPaste={preventPasteNegative} onKeyPress={preventMinus} />
                                            </td>
                                            <td>
                                                <input type="number" min="0" onFocus={handleFocus} maxLength={7} onInput={(e) => maxLengthCheck(e)}name="rnmMati" className="form-control" value={value.rnmMati} 
                                                        onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onPaste={preventPasteNegative} onKeyPress={preventMinus} />
                                            </td>
                                            <td>
                                                <input type="number" min="0" onFocus={handleFocus} maxLength={7} onInput={(e) => maxLengthCheck(e)}name="rnmTotal" className="form-control" value={value.rnmTotal} 
                                                        onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onPaste={preventPasteNegative} onKeyPress={preventMinus} />
                                            </td>
                                            <td>
                                                <input type="number" min="0" onFocus={handleFocus} maxLength={7} onInput={(e) => maxLengthCheck(e)}name="nrMati" className="form-control" value={value.nrMati} 
                                                        onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onPaste={preventPasteNegative} onKeyPress={preventMinus} />
                                            </td>
                                            <td>
                                                <input type="number" min="0" onFocus={handleFocus} maxLength={7} onInput={(e) => maxLengthCheck(e)}name="nrTotal" className="form-control" value={value.nrTotal} 
                                                        onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onPaste={preventPasteNegative} onKeyPress={preventMinus} />
                                            </td>
                                            <td>
                                                <input type="number" min="0" onFocus={handleFocus} maxLength={7} onInput={(e) => maxLengthCheck(e)}name="dirujuk" className="form-control" value={value.dirujuk} 
                                                        onChange={e => changeHandler(e, index)} disabled={disabledDirujuk} onPaste={preventPasteNegative} onKeyPress={preventMinus} />
                                            </td>
                                        </tr>
                                    )
                                }) }
                            </tbody>
                        </Table>
                    </div>
                </div>
                <div className="mt-3 mb-3">
                    <ToastContainer />
                    <button type="submit" disabled={buttonStatus} className="btn btn-outline-success"><HiSaveAs/> Simpan</button>
                </div>
            </form>
        </div>
    )
}

export default FormTambahRL35