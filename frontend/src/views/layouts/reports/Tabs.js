import Nav from 'react-bootstrap/Nav';

function Reporttabs() {
    return (
        <Nav fill variant="tabs" defaultActiveKey="/home" style={{ color: "black" }}>
            <Nav.Item>
                <Nav.Link href="home" color='red'>Active</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="link-1" style={{ color: "black" }}>Loooonger NavLink</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="link-2">Link</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="disabled" disabled>
                    Disabled
                </Nav.Link>
            </Nav.Item>
        </Nav>
    );
}

export default Reporttabs;