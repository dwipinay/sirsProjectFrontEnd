import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { Link, useNavigate } from 'react-router-dom'
import style from './FormTambahRL315.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { IoArrowBack } from 'react-icons/io5'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FormTambahRL315 = () => {
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
        getRLTigaTitikLimaBelasTemplate()
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
 
    const getRLTigaTitikLimaBelasTemplate = async() => {
        try {
            const response = await axiosJWT.get('/apisirs/caraPembayaran?rlid=16', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            // console.log(response)
            
            const rlTemplate = response.data.data.map((value, index) => {
                return {
                    id: value.id,
                    kodeProvinsi: 0,
                    kabKota: 0,
                    kodeRS: 0,
                    namaRS: 0,
                    tahun: 0,
                    no: value.no,
                    caraPembayaran: value.nama,
                    pasienRawatInapJpk: 0,
                    pasienRawatInapJld: 0,
                    jumlahPasienRawatJalan: 0,
                    jumlahPasienRawatJalanLab: 0,
                    jumlahPasienRawatJalanRad: 0,
                    jumlahPasienRawatJalanLl: 0,
                    disabledInput: true,
                    checked: false
                }
            })
            setDataRL(rlTemplate)
            // console.log(response.data.data)
        } catch (error) {
            
        }
    }
    // console.log(dataRL)
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
        } else if (name === 'no') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
              }
            newDataRL[index].no = event.target.value
      } else if (name === 'caraPembayaran') {
        if (event.target.value === '') {
            event.target.value = 0
            event.target.select(event.target.value)
          }
          newDataRL[index].caraPembayaran = event.target.value
      } else if (name === 'pasienRawatInapJpk') {
        if (event.target.value === '') {
            event.target.value = 0
            event.target.select(event.target.value)
          }
          newDataRL[index].pasienRawatInapJpk = event.target.value
      } else if (name === 'pasienRawatInapJld') {
        if (event.target.value === '') {
            event.target.value = 0
            event.target.select(event.target.value)
          }
          newDataRL[index].pasienRawatInapJld = event.target.value
      } else if (name === 'jumlahPasienRawatJalan') {
        if (event.target.value === '') {
            event.target.value = 0
            event.target.select(event.target.value)
          }
          newDataRL[index].jumlahPasienRawatJalan = event.target.value
      } else if (name === 'jumlahPasienRawatJalanLab') {
        if (event.target.value === '') {
            event.target.value = 0
            event.target.select(event.target.value)
          }
          newDataRL[index].jumlahPasienRawatJalanLab = event.target.value
          newDataRL[index].jumlahPasienRawatJalan = parseInt(event.target.value) + 
          parseInt(dataRL[index].jumlahPasienRawatJalanRad) + 
          parseInt(dataRL[index].jumlahPasienRawatJalanLl)
      } else if (name === 'jumlahPasienRawatJalanRad') {
        if (event.target.value === '') {
            event.target.value = 0
            event.target.select(event.target.value)
          }
          newDataRL[index].jumlahPasienRawatJalanRad = event.target.value
          newDataRL[index].jumlahPasienRawatJalan = parseInt(event.target.value) + 
          parseInt(dataRL[index].jumlahPasienRawatJalanLab) + 
          parseInt(dataRL[index].jumlahPasienRawatJalanLl)
      } else if (name === 'jumlahPasienRawatJalanLl') {
        if (event.target.value === '') {
            event.target.value = 0
            event.target.select(event.target.value)
          }
          newDataRL[index].jumlahPasienRawatJalanLl = event.target.value
          newDataRL[index].jumlahPasienRawatJalan = parseInt(event.target.value) + 
          parseInt(dataRL[index].jumlahPasienRawatJalanLab) + 
          parseInt(dataRL[index].jumlahPasienRawatJalanRad)
      } 
        setDataRL(newDataRL)

        let jumlahTotal = [...dataRL]

        if (index == 2 || index == 3 || index == 4 || index == 5){
            jumlahTotal[1].pasienRawatInapJpk= (
                parseInt(dataRL[2].pasienRawatInapJpk) +
                parseInt(dataRL[3].pasienRawatInapJpk) +
                parseInt(dataRL[4].pasienRawatInapJpk) +
                parseInt(dataRL[5].pasienRawatInapJpk) 
                )

            jumlahTotal[1].pasienRawatInapJld= (
                parseInt(dataRL[2].pasienRawatInapJld) +
                parseInt(dataRL[3].pasienRawatInapJld) +
                parseInt(dataRL[4].pasienRawatInapJld) +
                parseInt(dataRL[5].pasienRawatInapJld)
                )

            jumlahTotal[1].jumlahPasienRawatJalan= (
                parseInt(dataRL[2].jumlahPasienRawatJalan) +
                parseInt(dataRL[3].jumlahPasienRawatJalan) +
                parseInt(dataRL[4].jumlahPasienRawatJalan) +
                parseInt(dataRL[5].jumlahPasienRawatJalan)
                )

            jumlahTotal[1].jumlahPasienRawatJalanLab= (
                parseInt(dataRL[2].jumlahPasienRawatJalanLab) +
                parseInt(dataRL[3].jumlahPasienRawatJalanLab) +
                parseInt(dataRL[4].jumlahPasienRawatJalanLab) +
                parseInt(dataRL[5].jumlahPasienRawatJalanLab)
                )
            
            jumlahTotal[1].jumlahPasienRawatJalanRad= (
                parseInt(dataRL[2].jumlahPasienRawatJalanRad) +
                parseInt(dataRL[3].jumlahPasienRawatJalanRad) +
                parseInt(dataRL[4].jumlahPasienRawatJalanRad) +
                parseInt(dataRL[5].jumlahPasienRawatJalanRad)
                )

            jumlahTotal[1].jumlahPasienRawatJalanLl= (
                parseInt(dataRL[2].jumlahPasienRawatJalanLl) +
                parseInt(dataRL[3].jumlahPasienRawatJalanLl) +
                parseInt(dataRL[4].jumlahPasienRawatJalanLl) +
                parseInt(dataRL[5].jumlahPasienRawatJalanLl)
                )
        
            //jumlahTotal[1].checked = false
            setDataRL(jumlahTotal)
        } else if (index == 8 || index == 9 || index == 10){
            jumlahTotal[7].pasienRawatInapJpk= (
                parseInt(dataRL[8].pasienRawatInapJpk) +
                parseInt(dataRL[9].pasienRawatInapJpk) +
                parseInt(dataRL[10].pasienRawatInapJpk) 
                )

            jumlahTotal[7].pasienRawatInapJld= (
                parseInt(dataRL[8].pasienRawatInapJld) +
                parseInt(dataRL[9].pasienRawatInapJld) +
                parseInt(dataRL[10].pasienRawatInapJld) 
                )

            jumlahTotal[7].jumlahPasienRawatJalan= (
                parseInt(dataRL[8].jumlahPasienRawatJalan) +
                parseInt(dataRL[9].jumlahPasienRawatJalan) +
                parseInt(dataRL[10].jumlahPasienRawatJalan) 
                )

            jumlahTotal[7].jumlahPasienRawatJalanLab= (
                parseInt(dataRL[8].jumlahPasienRawatJalanLab) +
                parseInt(dataRL[9].jumlahPasienRawatJalanLab) +
                parseInt(dataRL[10].jumlahPasienRawatJalanLab) 
                )
            
            jumlahTotal[7].jumlahPasienRawatJalanRad= (
                parseInt(dataRL[8].jumlahPasienRawatJalanRad) +
                parseInt(dataRL[9].jumlahPasienRawatJalanRad) +
                parseInt(dataRL[10].jumlahPasienRawatJalanRad) 
                )

            jumlahTotal[7].jumlahPasienRawatJalanLl= (
                parseInt(dataRL[8].jumlahPasienRawatJalanLl) +
                parseInt(dataRL[9].jumlahPasienRawatJalanLl) +
                parseInt(dataRL[10].jumlahPasienRawatJalanLl) 
                )
            
                setDataRL(jumlahTotal)
            }
    }

    const Simpan = async (e) => {
        e.preventDefault()
        try {
            const dataRLArray = dataRL.filter((value) => {
                return value.checked === true
            }).map((value, index) => {
                return {
                    "caraPembayaranId": parseInt(value.id),
                    "pasienRawatInapJpk": parseInt(value.pasienRawatInapJpk),
                    "pasienRawatInapJld": parseInt(value.pasienRawatInapJld),
                    "jumlahPasienRawatJalan": parseInt(value.jumlahPasienRawatJalan),
                    "jumlahPasienRawatJalanLab": parseInt(value.jumlahPasienRawatJalanLab),
                    "jumlahPasienRawatJalanRad": parseInt(value.jumlahPasienRawatJalanRad),
                    "jumlahPasienRawatJalanLl": parseInt(value.jumlahPasienRawatJalanLl)
                }
            })

            const customConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
            const result = await axiosJWT.post('/apisirs/rltigatitiklimabelas',{
                tahun: parseInt(tahun),
                data: dataRLArray
            }, customConfig);
            // console.log(result.data)
            toast('Data Berhasil Disimpan', {
                position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => {
                navigate('/rl315')
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
                        <div className="mt-3 mb-3">
                        {/* <Link to='/rl315'className="btn btn-outline-success">Lihat Data RL 3.15</Link> */}
                    </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                    {/* <Link to={`/rl315/`} style={{textDecoration: "none"}}>
                        <IoArrowBack size={30} style={{color:"gray",cursor: "pointer"}}/><span style={{color: "gray"}}>RL 3.15 Cara Bayar</span>
                    </Link> */}
                    <Link to={`/rl315/`} className='btn btn-info' style={{fontSize:"18px", backgroundColor: "#779D9E", color: "#FFFFFF"}}>
                            {/* <IoArrowBack size={30} style={{color:"gray",cursor: "pointer"}}/> */}
                            &lt;
                        </Link>
                        <span style={{color: "gray"}}>Kembali RL 3.15 Cara Bayar</span>
                        <table className={style.rlTable}>
                            <thead>
                                <tr>
                                    <th style={{"width": "4%"}}>No Pembayaran</th>
                                    <th style={{"width": "3%"}}></th>
                                    {/* //<th style={{"width": "4%"}}>No Pembayaran</th> */}
                                    <th style={{"width": "30%"}}>Cara Pembayaran</th>
                                    <th>Pasien Rawat Inap JPK</th>
                                    <th>Pasien Rawat Inap JLD</th>
                                    <th>Jumlah Pasien Rawat Jalan</th>
                                    <th>Jumlah Pasien Rawat Jalan LAB</th>
                                    <th>Jumlah Pasien Rawat Jalan RAD</th>
                                    <th>Jumlah Pasien Rawat Jalan LL</th>
                                </tr>
                            </thead>
                            <tbody>
                            {dataRL.map((value, index) => {
                                let disabled = true
                                let visibled = true

                                if(value.no == 2 || value.no == 4){
                                    disabled = true
                                    visibled = "none" 
                                } else {
                                    disabled = false
                                    visibled = "block"
                                }
                                    return (
                                        <tr key={value.id}  >
                                            {/* <td>
                                                <input type='text' name='id' className="form-control" value={index+1} disabled={true}/>
                                            </td> */}
                                            <td>
                                                <input type="text" name="no" className="form-control" value={value.no} disabled={true} />
                                            </td>
                                            <td style={{textAlign: "center", verticalAlign: "middle"}}>
                                                <input type="checkbox" name='check' className="form-check-input" onChange={e => changeHandler(e, index)} checked={value.checked} disabled={disabled} style={{display: visibled}}/>
                                            </td>
                                            
                                            <td>
                                                <input type="text" name="caraPembayaran" className="form-control" value={value.caraPembayaran} disabled={true} />
                                            </td>
                                            <td>
                                                <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="pasienRawatInapJpk" className="form-control" value={value.pasienRawatInapJpk} 
                                                onChange={e => changeHandler(e, index)} disabled={value.disabledInput} />
                                            </td>
                                            <td>
                                                <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="pasienRawatInapJld" className="form-control" value={value.pasienRawatInapJld} 
                                                onChange={e => changeHandler(e, index)} disabled={value.disabledInput} />
                                            </td>
                                            <td>
                                                <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="jumlahPasienRawatJalan" className="form-control" value={value.jumlahPasienRawatJalan} 
                                                onChange={e => changeHandler(e, index)} disabled={true} />
                                            </td>
                                            <td>
                                                <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="jumlahPasienRawatJalanLab" className="form-control" value={value.jumlahPasienRawatJalanLab} 
                                                onChange={e => changeHandler(e, index)} disabled={value.disabledInput} />
                                            </td>
                                            <td>
                                                <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="jumlahPasienRawatJalanRad" className="form-control" value={value.jumlahPasienRawatJalanRad} 
                                                onChange={e => changeHandler(e, index)} disabled={value.disabledInput} />
                                            </td>
                                            <td>
                                                <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="jumlahPasienRawatJalanLl" className="form-control" value={value.jumlahPasienRawatJalanLl} 
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

export default FormTambahRL315