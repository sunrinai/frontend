import logo from "../assets/ailogo.svg"

const HeaderStyle = {
    width: '100%',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '16px',
    gap:"16px",
    p : {
        fontSize: '25px',
        color: 'white',
    }
}

export default function Header() {
    return (
        <div style={HeaderStyle}>
            <img src={logo} alt="ailogo" style={{height: 25.2}} />
            <p style={HeaderStyle.p}>HAIE</p>
        </div>
    )
}