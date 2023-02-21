import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate, Link } from 'react-router-dom'
import style from './FormTambahRL313B.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { IoArrowBack } from 'react-icons/io5'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Table from 'react-bootstrap/esm/Table'
import Spinner from 'react-bootstrap/esm/Spinner'

const FormTambahRL313B = () => {
    const [tahun, setTahun] = useState('2022')
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


    useEffect(() => {
        refreshToken()
        // getDataRS()
        getRLTigaTitikTigaBelasBTemplate()
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
            console.log(response.data)
            setNamaRS(response.data.data[0].nama)
            setAlamatRS(response.data.data[0].alamat)
            setNamaPropinsi(response.data.data[0].propinsi.nama)
            setNamaKabKota(response.data.data[0].kabKota.nama)
        } catch (error) {
            
        }
    }

    const getRLTigaTitikTigaBelasBTemplate = async() => {
        setSpinner(true)
        try {
            const response = await axiosJWT.get('/apisirs/getgolonganobat', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            
            const rlTemplate = response.data.data.map((value, index) => {
                return {
                    id: value.id,
                    kodeProvinsi: 0,
                    kabKota: 0,
                    kodeRS: 0,
                    namaRS: 0,
                    tahun: 0,
                    no: value.no,
                    golonganObat: value.nama,
                    rawatJalan: 0,
                    igd: 0,
                    rawatInap: 0,
                    disabledInput: true,
                    checked: false
                }
            })
            setDataRL(rlTemplate)
            setSpinner(false)
            console.log(response.data.data)
        } catch (error) {
            
        }
    }

    const changeHandlerSingle = (event) => {
        setTahun(event.target.value)
    }

    const handleFocus = (event) => event.target.select()

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
        } else if (name === 'no') {
            newDataRL[index].no = event.target.value
        } else if (name === 'golonganObat') {
            newDataRL[index].golonganObat = event.target.value
        } else if (name === 'rawatJalan') {
            if(event.target.value === ''){   
                event.target.value = 0
                event.target.select(event.target.value)
                }
            newDataRL[index].rawatJalan = event.target.value
        } else if (name === 'igd') {
            if(event.target.value === ''){   
                event.target.value = 0
                event.target.select(event.target.value)
                }
            newDataRL[index].igd = event.target.value
        } else if (name === 'rawatInap') {
            if(event.target.value === ''){   
                event.target.value = 0
                event.target.select(event.target.value)
                }
            newDataRL[index].rawatInap = event.target.value
        }
        setDataRL(newDataRL)
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
                    "golonganObatId": value.id,
                    "rawatJalan": value.rawatJalan,
                    "igd": value.igd,
                    "rawatInap": value.rawatInap
                }
            })

            const customConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
            await axiosJWT.post('/apisirs/rltigatitiktigabelasb',{
                tahun: parseInt(tahun),
                data: dataRLArray
            }, customConfig)
            setSpinner(false)
            // console.log(result.data)
            toast('Data Berhasil Disimpan', {
                position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => {
                navigate('/rl313b')
            }, 1000);
        } catch (error) {
            toast(`Data tidak bisa disimpan karena ,${error.response.data.message}`, {
                position: toast.POSITION.TOP_RIGHT
            })
            setButtonStatus(false)
            setSpinner(false)
        }
    }
    const preventPasteNegative = (e) => {
        const clipboardData = e.clipboardData || window.clipboardData;
        const pastedData = parseFloat(clipboardData.getData('text'));
    
        if (pastedData < 0) {
            e.preventDefault();
        }
    }
    
    const preventMinus = (e) => {
        if (e.code === 'Minus') {
            e.preventDefault();
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
                                    <input name="tahun" type="text" className="form-control" id="floatingInput" 
                                        placeholder="Tahun" value={tahun} onChange={e => changeHandlerSingle(e)} disabled/>
                                    <label htmlFor="floatingInput">Tahun</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        <Link to={`/rl313b/`} style={{textDecoration: "none"}}>
                            <IoArrowBack size={30} style={{color:"gray",cursor: "pointer"}}/><span style={{color: "gray"}}></span>
                            <span style={{color: "gray"}}>RL 3.13 Obat Pelayanan Resep</span>
                        </Link>
                        <div className="container" style={{ textAlign: "center" }}>
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                        </div>
                        <Table className={style.rlTable}>
                            <thead>
                                <tr>
                                    <th>No Golongan Obat</th>
                                    <th style={{"width": "2%"}}></th>
                                    <th>Golongan Obat</th>
                                    <th>Rawat Jalan</th>
                                    <th>IGD</th>
                                    <th>Rawat Inap</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataRL.map((value, index) => {
                                    return (
                                        <tr key={value.id}>
                                            <td><center>{value.no}</center></td>
                                            <td style={{textAlign: "center", verticalAlign: "middle"}}>
                                                <input type="checkbox" name='check' className="form-check-input" onChange={e => changeHandler(e, index)} checked={value.checked}/>
                                            </td>
                                            <td>
                                            {value.golonganObat}
                                            </td>
                                            
                                            <td><input type="number" min={0} maxLength={7}
                                                onInput={(e) => maxLengthCheck(e)} name="rawatJalan" className="form-control" value={value.rawatJalan} 
                                                onFocus={handleFocus}  onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" min={0} maxLength={7}
                                                onInput={(e) => maxLengthCheck(e)} name="igd" className="form-control" value={value.igd} 
                                                onFocus={handleFocus}  onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" min={0} maxLength={7}
                                                onInput={(e) => maxLengthCheck(e)} name="rawatInap" className="form-control" value={value.rawatInap} 
                                                onFocus={handleFocus}  onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
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
                    <button type="submit" className="btn btn-outline-success" disabled={buttonStatus}><HiSaveAs/> Simpan</button>
                </div>
            </form>
        </div>
        
    )
}

export default FormTambahRL313B