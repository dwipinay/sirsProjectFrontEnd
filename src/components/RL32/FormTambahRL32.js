import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import style from './FormTambahRL32.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { IoArrowBack } from 'react-icons/io5'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'
 
const FormTambahRL32 = () => {
    const [tahun, setTahun] = useState('')
    const [namaRS, setNamaRS] = useState('')
    const [alamatRS, setAlamatRS] = useState('')
    const [namaPropinsi, setNamaPropinsi] = useState('')
    const [namaKabKota, setNamaKabKota] = useState('')
    const [dataRL, setDataRL] = useState([])
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        refreshToken()
        getRLTigaTitikDuaTemplate()
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
            // console.log(response.data)
            setNamaRS(response.data.data[0].nama)
            setAlamatRS(response.data.data[0].alamat)
            setNamaPropinsi(response.data.data[0].propinsi.nama)
            setNamaKabKota(response.data.data[0].kabKota.nama)
        } catch (error) {
            
        }
    }

    const getRLTigaTitikDuaTemplate = async() => {
        try {
            const response = await axiosJWT.get('/apisirs/jenispelayanan?rlid=2', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            
            const rlTemplate = response.data.data.map((value, index) => {
                return {
                    id: value.id,
                    no: value.no,
                    jenisPelayanan: value.nama,
                    totalPasienRujukan: 0,
                    totalPasienNonRujukan: 0,
                    tindakLanjutPelayananDirawat: 0,
                    tindakLanjutPelayananDirujuk: 0,
                    tindakLanjutPelayananPulang: 0,
                    matiDiUGD: 0,
                    doa: 0,
                    disabledInput: true,
                    checked: false
                }
            })
            setDataRL(rlTemplate)
        } catch (error) {
            
        }
    }

    const changeHandlerSingle = (event) => {
        setTahun(event.target.value)
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
        } else if (name === 'totalPasienRujukan') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
              }
              newDataRL[index].totalPasienRujukan = event.target.value
        } else if (name === 'totalPasienNonRujukan') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
              }
            newDataRL[index].totalPasienNonRujukan = event.target.value
        } else if (name === 'tindakLanjutPelayananDirawat') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
              }
            newDataRL[index].tindakLanjutPelayananDirawat = event.target.value
        } else if (name === 'tindakLanjutPelayananDirujuk') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
              }
            newDataRL[index].tindakLanjutPelayananDirujuk = event.target.value
        } else if (name === 'tindakLanjutPelayananPulang') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
              }
            newDataRL[index].tindakLanjutPelayananPulang = event.target.value
        } else if (name === 'matiDiUGD') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
              }
            newDataRL[index].matiDiUGD = event.target.value
        } else if (name === 'doa') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
              }
            newDataRL[index].doa = event.target.value
        }
        setDataRL(newDataRL)
    }

    const Simpan = async (e) => {
        e.preventDefault()
        try {
            const dataRLArray = dataRL.filter((value) => {
                return value.checked === true
            }).map((value, index) => {
                return {
                    "jenisPelayananId": parseInt(value.id),
                    "totalPasienRujukan": parseInt(value.totalPasienRujukan),
                    "totalPasienNonRujukan": parseInt(value.totalPasienNonRujukan),
                    "tindakLanjutPelayananDirawat": parseInt(value.tindakLanjutPelayananDirawat),
                    "tindakLanjutPelayananDirujuk": parseInt(value.tindakLanjutPelayananDirujuk),
                    // "tindakLanjutPelayananPulang": parseInt(value.tindakLanjutPelayananPulang),
                    "matiDiUGD": parseInt(value.matiDiUGD),
                    "doa": parseInt(value.doa)
                }
            })

            const customConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }

            const result = await axiosJWT.post('/apisirs/rltigatitikdua',{
                tahun: parseInt(tahun),
                data: dataRLArray
            }, customConfig)

            // console.log(result.data)
            toast('Data Berhasil Disimpan', {
                position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => {
                navigate('/rl32')
            }, 1000);
        } catch (error) {
            toast(`Data tidak bisa disimpan karena ,${error.response.data.message}`, {
                position: toast.POSITION.TOP_RIGHT
            })
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
                                        placeholder="Tahun" value={tahun} disabled={true}/>
                                    <label htmlFor="floatingInput">Tahun</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                    <Link to={`/rl32/`} style={{textDecoration: "none"}}>
                            <IoArrowBack size={30} style={{color:"gray",cursor: "pointer"}}/><span style={{color: "gray"}}>RL 3.2 Rawat Darurat</span>
                        </Link>
                        <table className={style.rlTable}>
                            <thead>
                                <tr>
                                    <th style={{"width": "4%"}}>No.</th>
                                    <th style={{"width": "2%"}}></th>
                                    <th style={{"width": "20%"}}>Jenis Pelayanan</th>
                                    <th>Total Pasien Rujukan</th>
                                    <th>Total Pasien Non Rujukan</th>
                                    <th>Tindak Lanjut Pelayanan Dirawat</th>
                                    <th>Tindak Lanjut Pelayanan Dirujuk</th>
                                    {/* <th>Tindak Lanjut Pelayanan Pulang</th> */}
                                    <th>Mati Di UGD</th>
                                    <th>DOA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataRL.map((value, index) => {
                                    return (
                                        <tr key={value.id}>
                                            <td>
                                                <input type='hidden' name='id' className="form-control" value={value.id} disabled={true}/>
                                                <input type='text' name='no' className="form-control" value={value.no} disabled={true}/>
                                            </td>
                                            <td style={{textAlign: "center", verticalAlign: "middle"}}>
                                                <input type="checkbox" name='check' className="form-check-input" onChange={e => changeHandler(e, index)} checked={value.checked}/>
                                            </td>
                                            <td>
                                                <input type="text" name="jenisPelayanan" className="form-control" value={value.jenisPelayanan} disabled={true} />
                                            </td>
                                            <td>
                                                <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="totalPasienRujukan" className="form-control" value={value.totalPasienRujukan} 
                                                onChange={e => changeHandler(e, index)} disabled={value.disabledInput} />
                                            </td>
                                            <td>
                                                <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="totalPasienNonRujukan" className="form-control" value={value.totalPasienNonRujukan} 
                                                onChange={e => changeHandler(e, index)} disabled={value.disabledInput} />
                                            </td>
                                            <td>
                                                <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="tindakLanjutPelayananDirawat" className="form-control" value={value.tindakLanjutPelayananDirawat} 
                                                onChange={e => changeHandler(e, index)} disabled={value.disabledInput} />
                                            </td>
                                            <td>
                                                <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="tindakLanjutPelayananDirujuk" className="form-control" value={value.tindakLanjutPelayananDirujuk} 
                                                onChange={e => changeHandler(e, index)} disabled={value.disabledInput} />
                                            </td>
                                            {/* <td>
                                                <input type="number" min='0' onPaste={preventPasteNegative} onKeyPress={preventMinus} name="tindakLanjutPelayananPulang" className="form-control" value={value.tindakLanjutPelayananPulang} 
                                                onChange={e => changeHandler(e, index)} disabled={true} />
                                            </td> */}
                                            <td>
                                                <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="matiDiUGD" className="form-control" value={value.matiDiUGD} 
                                                onChange={e => changeHandler(e, index)} disabled={value.disabledInput} />
                                            </td>
                                            <td>
                                                <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="doa" className="form-control" value={value.doa} 
                                                onChange={e => changeHandler(e, index)} disabled={value.disabledInput} />
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
                    <button type="submit" className="btn btn-outline-success"><HiSaveAs/> Simpan</button>
                </div>
            </form>
        </div>
    )
}

export default FormTambahRL32