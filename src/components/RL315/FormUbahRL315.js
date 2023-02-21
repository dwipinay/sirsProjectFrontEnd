import React, { useState, useEffect } from "react"
import axios from "axios"
import jwt_decode from 'jwt-decode'
import { useNavigate, useParams } from "react-router-dom"
import style from './FormTambahRL315.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { IoArrowBack } from 'react-icons/io5'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'

export const FormUbahRL315 = () => {
    const [tahun, setTahun] = useState('')
    const [namaRS, setNamaRS] = useState('')
    const [alamatRS, setAlamatRS] = useState('')
    const [namaPropinsi, setNamaPropinsi] = useState('')
    const [namaKabKota, setNamaKabKota] = useState('')
    const [caraPembayaran, setCaraPembayaran] = useState('')
    const [pasienRawatInapJpk, setPasienRawatInapJpk] = useState('')
    const [pasienRawatInapJld, setPasienRawatInapJld] = useState('')
    const [jumlahPasienRawatJalan, setJumlahPasienRawatJalan] = useState('')
    const [jumlahPasienRawatJalanLab, setJumlahPasienRawatJalanLab] = useState('')
    const [jumlahPasienRawatJalanRad, setJumlahPasienRawatJalanRad] = useState('')
    const [jumlahPasienRawatJalanLl, setJumlahPasienRawatJalanLl] = useState('')
    const [dataRL, setDataRL] = useState([])
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const navigate = useNavigate()
    const { id } = useParams();
    
    useEffect(() => {
        refreshToken()
        getDataRLTigaTitikLimaBelasDetailById(id);
    }, []);

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
            //console.log(response.data)
            setNamaRS(response.data.data[0].nama)
            setAlamatRS(response.data.data[0].alamat)
            setNamaPropinsi(response.data.data[0].propinsi.nama)
            setNamaKabKota(response.data.data[0].kabKota.nama)
        } catch (error) {
            console.log(error)
        }
    }

    const getDataRLTigaTitikLimaBelasDetailById = async (id) => {
        try {
            const response = await axiosJWT.get('/apisirs/rltigatitiklimabelasdetail/' + id, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            // console.log(response.data.data[0])
            setCaraPembayaran(response.data.data[0].cara_pembayaran.nama)
            setPasienRawatInapJpk(response.data.data[0].pasien_rawat_inap_jpk)
            setPasienRawatInapJld(response.data.data[0].pasien_rawat_inap_jld)
            setJumlahPasienRawatJalan(response.data.data[0].jumlah_pasien_rawat_jalan)
            setJumlahPasienRawatJalanLab(response.data.data[0].jumlah_pasien_rawat_jalan_lab)
            setJumlahPasienRawatJalanRad(response.data.data[0].jumlah_pasien_rawat_jalan_rad)
            setJumlahPasienRawatJalanLl(response.data.data[0].jumlah_pasien_rawat_jalan_ll)

            
        } catch (error) {
            console.log(error)
        }
    }

    const changeHandler = (event, index) => {
        if (event.target.value === '') {
            event.target.value = 0
            event.target.select(event.target.value)
          }
        const targetName = event.target.name
        switch (targetName) {
            case "caraPembayaran":
                setCaraPembayaran(event.target.value)
                break
            case "pasienRawatInapJpk":
                setPasienRawatInapJpk(event.target.value)
                break
            case "pasienRawatInapJld":
                setPasienRawatInapJld(event.target.value)
                break
            case "jumlahPasienRawatJalan":
                setJumlahPasienRawatJalan(event.target.value)
                break
            case "jumlahPasienRawatJalanLab":
                setJumlahPasienRawatJalanLab(event.target.value)
                break
            case "jumlahPasienRawatJalanRad":
                setJumlahPasienRawatJalanRad(event.target.value)
                break
            case "jumlahPasienRawatJalanLl":
                setJumlahPasienRawatJalanLl(event.target.value)
                break
        }
    }

    const Simpan = async (e) => {
        e.preventDefault()
        try {
            const data = {
                "cara_pembayaran.nama": caraPembayaran,
                "pasien_rawat_inap_jpk": pasienRawatInapJpk,
                "pasien_rawat_inap_jld": pasienRawatInapJld,
                "jumlah_pasien_rawat_jalan": jumlahPasienRawatJalan,
                "jumlah_pasien_rawat_jalan_lab": jumlahPasienRawatJalanLab,
                "jumlah_pasien_rawat_jalan_rad": jumlahPasienRawatJalanRad,
                "jumlah_pasien_rawat_jalan_ll": jumlahPasienRawatJalanLl
            }

            const customConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }

            const result = await axiosJWT.patch('/apisirs/rltigatitiklimabelasdetail/' + id, data, customConfig)
            
            toast('Data Berhasil Diubah', {
                position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => {
                navigate('/rl315')
            }, 1000);
        } catch (error) {
            console.log(error)
            toast('Data Gagal Disimpan', {
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
                                value={ namaKabKota } disabled={true}/>
                            <label htmlFor="floatingInput">Kab/Kota</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="row mt-3">
            <div className="col-md-12">
                <Link to={`/rl315/`} style={{textDecoration: "none"}}>
                    <IoArrowBack size={30} style={{color:"gray",cursor: "pointer"}}/><span style={{color: "gray"}}>RL 3.15 Cara Bayar</span>
                </Link>
                        <table className={style.rlTable}>
                            <thead>
                                <tr>
                                    <th style={{"width": "4%"}}>No Pembayaran</th>
                                    {/* <th style={{"width": "3%"}}></th>
                                    <th style={{"width": "4%"}}>No Pembayaran</th> */}
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
                                <td>
                                    <input type="text" name="id" className="form-control" value="1" disabled={true} />
                                </td>
                                 <td>
                                    <input type="text" name="caraPembayaran" className="form-control" value={caraPembayaran} disabled={true} />
                                </td>
                                <td>
                                    <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="pasienRawatInapJpk" className="form-control" 
                                    value={pasienRawatInapJpk} 
                                    onChange={e => changeHandler(e)} />
                                </td>
                                <td>
                                    <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="pasienRawatInapJld" className="form-control" value={pasienRawatInapJld} 
                                    onChange={e => changeHandler(e)} />
                                </td>
                                <td>
                                    <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="jumlahPasienRawatJalan" className="form-control" value={jumlahPasienRawatJalan} 
                                    onChange={e => changeHandler(e)} />
                                </td>
                                <td>
                                    <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="jumlahPasienRawatJalanLab" className="form-control" value={jumlahPasienRawatJalanLab} 
                                    onChange={e => changeHandler(e)} />
                                </td>
                                <td>
                                    <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="jumlahPasienRawatJalanRad" className="form-control" value={jumlahPasienRawatJalanRad} 
                                    onChange={e => changeHandler(e)} />
                                </td>
                                <td>
                                    <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="jumlahPasienRawatJalanLl" className="form-control" value={jumlahPasienRawatJalanLl} 
                                    onChange={e => changeHandler(e)} />
                                </td>
                            </tbody>
                        </table>
            </div>
        </div>
        <div className="mt-3 mb-3">
        <ToastContainer />
            <button type="submit" className="btn btn-outline-success"><HiSaveAs/> Update</button>
        </div>
    </form>
</div>
  )
}

export default FormUbahRL315