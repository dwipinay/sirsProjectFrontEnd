import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import style from "./FormTambahRL4B.module.css";
import { useNavigate, Link } from "react-router-dom";
import { HiSaveAs } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Table from "react-bootstrap/Table";
import { RiDeleteBin5Fill, RiEdit2Fill } from "react-icons/ri";
import { AiFillFileAdd } from "react-icons/ai";
import Spinner from "react-bootstrap/Spinner";

const RL4B = () => {
  const [namaRS, setNamaRS] = useState("");
  const [alamatRS, setAlamatRS] = useState("");
  const [namaPropinsi, setNamaPropinsi] = useState("");
  const [namaKabKota, setNamaKabKota] = useState("");
  const [tahun, setTahun] = useState(new Date().getFullYear() - 1);
  const [dataRL, setDataRL] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const navigate = useNavigate();
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    refreshToken();
    CariLastYear(new Date().getFullYear() - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("/apisirs/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setExpire(decoded.exp);
      getDataRS(decoded.rsId);
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  };

  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get("/apisirs/token");
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const getDataRS = async (id) => {
    try {
      const response = await axiosJWT.get("/apisirs/rumahsakit/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNamaRS(response.data.data[0].nama);
      setAlamatRS(response.data.data[0].alamat);
      setNamaPropinsi(response.data.data[0].propinsi.nama);
      setNamaKabKota(response.data.data[0].kabKota.nama);
    } catch (error) {}
  };

  const CariLastYear = async (tahun) => {
    setSpinner(true)
    try {
      const customConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          tahun: tahun,
        },
      };
      const results = await axiosJWT.get("/apisirs/rlempatb", customConfig);

      const rlEmpatDetails = results.data.data.map((value) => {
        return value.rl_empat_b_details;
      });

      let datarlEmpatDetails = [];
      rlEmpatDetails.forEach((element) => {
        element.forEach((value) => {
          datarlEmpatDetails.push(value);
        });
      });

      setDataRL(datarlEmpatDetails);
      setSpinner(false)
    } catch (error) {
      console.log(error);
    }
  };

  const Cari = async (e) => {
    e.preventDefault();
    setSpinner(true)
    try {
      const customConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          tahun: tahun,
        },
      };
      const results = await axiosJWT.get("/apisirs/rlempatb", customConfig);

      const rlEmpatDetails = results.data.data.map((value) => {
        return value.rl_empat_b_details;
      });

      let datarlEmpatDetails = [];
      rlEmpatDetails.forEach((element) => {
        element.forEach((value) => {
          datarlEmpatDetails.push(value);
        });
      });

      setDataRL(datarlEmpatDetails);
      setSpinner(false)
    } catch (error) {
      console.log(error);
    }
  };

  const changeHandlerSingle = (event) => {
    setTahun(event.target.value);
  };

  const deleteDetailRL = async (id) => {
    try {
      const customConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axiosJWT.delete("/apisirs/rlempatb/" + id, customConfig);

      setDataRL((current) => current.filter((value) => value.id !== id));
      toast("Data Berhasil Dihapus", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.log(error);
      toast("Data Gagal Dihapus", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const Delete = (id) => {
    confirmAlert({
      title: "Konfirmasi Penghapusan",
      message: "Apakah Anda Yakin ?",
      buttons: [
        {
          label: "Ya",
          onClick: () => {
            deleteDetailRL(id);
          },
        },
        {
          label: "Tidak",
        },
      ],
    });
  };
  return (
    <div className="container" style={{ marginTop: "70px" }}>
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title h5">Profile Fasyankes</h5>
              <div
                className="form-floating"
                style={{ width: "100%", display: "inline-block" }}
              >
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  value={namaRS}
                  disabled={true}
                />
                <label htmlFor="floatingInput">Nama</label>
              </div>
              <div
                className="form-floating"
                style={{ width: "100%", display: "inline-block" }}
              >
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  value={alamatRS}
                  disabled={true}
                />
                <label htmlFor="floatingInput">Alamat</label>
              </div>
              <div
                className="form-floating"
                style={{ width: "50%", display: "inline-block" }}
              >
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  value={namaPropinsi}
                  disabled={true}
                />
                <label htmlFor="floatingInput">Provinsi </label>
              </div>
              <div
                className="form-floating"
                style={{ width: "50%", display: "inline-block" }}
              >
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  value={namaKabKota}
                  disabled={true}
                />
                <label htmlFor="floatingInput">Kab/Kota</label>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title h5">Periode Laporan</h5>
              <form onSubmit={Cari}>
                <div
                  className="form-floating"
                  style={{ width: "100%", display: "inline-block" }}
                >
                  <input
                    name="tahun"
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Tahun"
                    value={tahun}
                    onChange={(e) => changeHandlerSingle(e)}
                  />
                  <label htmlFor="floatingInput">Tahun</label>
                </div>
                <div className="mt-3 mb-3">
                  <button type="submit" className="btn btn-outline-success">
                    <HiSaveAs /> Cari
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-3 mb-3">
        <div className="col-md-12">
          <Link
            to={`/rl4b/tambah/`}
            style={{ textDecoration: "none", display: "flex" }}
          >
            <AiFillFileAdd
              size={30}
              style={{ color: "gray", cursor: "pointer" }}
            />
            <span style={{ color: "gray" }}>RL 4B Data Keadaan Morbiditas Pasien Rawat Jalan</span>
          </Link>
          <div className="container" style={{ textAlign: "center" }}>
              {/* <h5>test</h5> */}
              {spinner && <Spinner animation="grow" variant="success"></Spinner>}
              {spinner && <Spinner animation="grow" variant="success"></Spinner>}
              {spinner && <Spinner animation="grow" variant="success"></Spinner>}
              {spinner && <Spinner animation="grow" variant="success"></Spinner>}
              {spinner && <Spinner animation="grow" variant="success"></Spinner>}
              {spinner && <Spinner animation="grow" variant="success"></Spinner>}
            </div>
          <Table
            className={style.rlTable}
            bordered
            responsive
            style={{ width: "500%" }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  No.
                </th>
                <th>Aksi</th>
                <th
                  style={{
                    textAlign: "left",
                    wordBreak: "break-word",
                  }}
                >
                  GOLONGAN SEBAB PENYAKIT
                </th>
                <th>(JUMLAH) PASIEN GOLONGAN UMUR 0 - 6hr Laki-laki</th>
                <th>(JUMLAH) PASIEN GOLONGAN UMUR 0 - 6hr Perempuan</th>
                <th>(JUMLAH) PASIEN GOLONGAN UMUR 7 - 28hr Laki-laki</th>
                <th>(JUMLAH) PASIEN GOLONGAN UMUR 7 - 28hr Perempuan</th>
                <th>(JUMLAH) PASIEN GOLONGAN UMUR 29hr - &lt; 1th Laki-laki</th>
                <th>(JUMLAH) PASIEN GOLONGAN UMUR 29hr - &lt; 1th Perempuan</th>
                <th>(JUMLAH) PASIEN GOLONGAN UMUR 1th - 4th Laki-laki</th>
                <th>(JUMLAH) PASIEN GOLONGAN UMUR 1th - 4th Perempuan</th>
                <th>(JUMLAH) PASIEN GOLONGAN UMUR 5th - 14th Laki-laki</th>
                <th>(JUMLAH) PASIEN GOLONGAN UMUR 5th - 14th Perempuan</th>
                <th>(JUMLAH) PASIEN GOLONGAN UMUR 15th - 24th Laki-laki</th>
                <th>(JUMLAH) PASIEN GOLONGAN UMUR 15th - 24th Perempuan</th>
                <th>(JUMLAH) PASIEN GOLONGAN UMUR 25th - 44th Laki-laki</th>
                <th>(JUMLAH) PASIEN GOLONGAN UMUR 25th - 44th Perempuan</th>
                <th>(JUMLAH) PASIEN GOLONGAN UMUR 45th - 64th Laki-laki</th>
                <th>(JUMLAH) PASIEN GOLONGAN UMUR 45th - 64th Perempuan</th>
                <th>(JUMLAH) PASIEN GOLONGAN UMUR &gt; 64th Laki-laki</th>
                <th>(JUMLAH) PASIEN GOLONGAN UMUR &gt; 64th Perempuan</th>
                <th>KASUS BARU LAKI-LAKI</th>
                <th>KASUS BARU PEREMPUAN</th>
                <th>JUMLAH KASUS BARU</th>
                <th>JUMLAH KUNJUNGAN</th>
              </tr>
            </thead>
            <tbody>
              {dataRL.map((value, index) => {
                return (
                  <tr key={value.id}>
                    <td
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      <label>{index + 1}</label>
                    </td>
                    <td>
                      <ToastContainer />
                      <RiDeleteBin5Fill
                        size={20}
                        onClick={(e) => Delete(value.id)}
                        style={{
                          color: "gray",
                          cursor: "pointer",
                          marginRight: "5px",
                        }}
                      />
                      <Link to={`/rl4b/ubah/${value.id}`}>
                        <RiEdit2Fill
                          size={20}
                          style={{ color: "gray", cursor: "pointer" }}
                        />
                      </Link>
                    </td>
                    <td style={{ textAlign: "left" }}>
                      <label>{value.jenis_golongan_sebab_penyakit.nama}</label>
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={value.jmlh_pas_kasus_umur_sex_0_6hr_l}
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={value.jmlh_pas_kasus_umur_sex_0_6hr_p}
                        disabled
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={value.jmlh_pas_kasus_umur_sex_6_28hr_l}
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={value.jmlh_pas_kasus_umur_sex_6_28hr_p}
                        disabled
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={value.jmlh_pas_kasus_umur_sex_28hr_1th_l}
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={value.jmlh_pas_kasus_umur_sex_28hr_1th_p}
                        disabled
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={value.jmlh_pas_kasus_umur_sex_1_4th_l}
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={value.jmlh_pas_kasus_umur_sex_1_4th_p}
                        disabled
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={value.jmlh_pas_kasus_umur_sex_4_14th_l}
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={value.jmlh_pas_kasus_umur_sex_4_14th_p}
                        disabled
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={value.jmlh_pas_kasus_umur_sex_14_24th_l}
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={value.jmlh_pas_kasus_umur_sex_14_24th_p}
                        disabled
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={value.jmlh_pas_kasus_umur_sex_24_44th_l}
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={value.jmlh_pas_kasus_umur_sex_24_44th_p}
                        disabled
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={value.jmlh_pas_kasus_umur_sex_44_64th_l}
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={value.jmlh_pas_kasus_umur_sex_44_64th_p}
                        disabled
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={value.jmlh_pas_kasus_umur_sex_lebih_64th_l}
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={value.jmlh_pas_kasus_umur_sex_lebih_64th_p}
                        disabled
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={value.kasus_baru_l}
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={value.kasus_baru_p}
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={value.jumlah_kasus_baru}
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={value.jumlah_kunjungan}
                        disabled
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default RL4B;
