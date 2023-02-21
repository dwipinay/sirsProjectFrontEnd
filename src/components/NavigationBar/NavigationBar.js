import React, { useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown  from 'react-bootstrap/NavDropdown'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import logoImage from '../Images/sirsIcon.png'

const NavigationBar = () => {
    const navigate = useNavigate()
    useEffect(() => {
        document.title = "SIRS Online Versi 6"
    },[])
    const Logout = async() => {
        try {
            await axios.delete('/apisirs/logout')
            localStorage.removeItem('name')
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Navbar className="navbar fixed-top navbar-expand-lg" style={{backgroundSize: "0", backgroundColor: "#E1E6EA"}}>
            <Container>
                <Navbar.Brand as={Link} to="/beranda">
                    <img
                        src={logoImage}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        alt=""
                        as={Link} to="/rl31"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/beranda">Beranda</Nav.Link>
                        <NavDropdown title="RL.1" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/rl12">
                                RL 1.2 Indikator Pelayanan Rumah Sakit
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/rl13">
                                RL 1.3 Tempat Tidur
                            </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="RL.3" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/rl31">
                                RL 3.1 Rawat Inap
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/rl32">
                                RL 3.2 Rawat Darurat
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/rl33">
                                RL 3.3 Gigi dan Mulut
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/rl34">
                                RL 3.4 Kebidanan
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/rl35">
                                RL 3.5 Perinotologi
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/rl36">
                                RL 3.6 Pembedahan
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/rl37">
                                RL 3.7 Radiologi
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/rl38">
                                RL 3.8 Laboratorium
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/rl39">
                                RL 3.9 Rehabilitasi Medik
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/rl310">
                                RL 3.10 Pelayanan Khusus
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/rl311">
                                RL 3.11 Kesehatan Jiwa
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/rl312">
                                RL 3.12 Keluarga Berencana
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/rl313A">
                                RL 3.13A Farmasi Obat Pengadaan
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/rl313B">
                                RL 3.13B Farmasi Obat Pelayanan Resep
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/rl314">
                                RL 3.14 Rujukan
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/rl315">
                                RL 3.15 Cara Bayar
                            </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="RL.4" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/rl4a">
                                RL 4.a Penyakit Rawat Inap
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/rl4asebab">
                                RL 4.a Penyakit Rawat Inap Sebab
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/rl4b">
                                RL 4.b Penyakit Rawat Jalan
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/rl4bsebab">
                                RL 4.b Penyakit Rawat Jalan Sebab
                            </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="RL.5" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/rl51">
                                RL 5.1 Pengujung Rumah Sakit
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/rl52">
                                RL 5.2 Kunjungan Rawat Jalan
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/rl53">
                                RL 5.3 Daftar 10 Besar Penyakit Rawat Inap
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/rl54">
                                RL 5.4 Daftar 10 Besar Penyakit Rawat Jalan
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
                
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        <NavDropdown title={<span style={{color: "gray"}}>{`Login as ${localStorage.getItem('name')}`}</span>} id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/user/ubahpassword">Change Password</NavDropdown.Item>
                            <NavDropdown.Item onClick={Logout}>Log Out</NavDropdown.Item>
                        </NavDropdown>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavigationBar