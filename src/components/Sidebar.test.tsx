import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Sidebar from "./Sidebar";

describe("Sidebar", () => {
  it("renders all three menu items", () => {
    render(<Sidebar />);
    expect(screen.getByText("홈")).toBeDefined();
    expect(screen.getByText("데이터")).toBeDefined();
    expect(screen.getByText("문의하기")).toBeDefined();
  });

  it("홈 is active by default (bg-black text-white)", () => {
    render(<Sidebar />);
    // Desktop sidebar renders the buttons; find the one with "홈"
    const buttons = screen.getAllByText("홈");
    // The first match is the desktop sidebar button
    const homeButton = buttons[0].closest("button")!;
    expect(homeButton.className).toMatch(/bg-black/);
    expect(homeButton.className).toMatch(/text-white/);
  });

  it("clicking a menu item updates active state", async () => {
    const user = userEvent.setup();
    render(<Sidebar />);

    // Click "데이터" in desktop sidebar (first occurrence)
    const dataButtons = screen.getAllByText("데이터");
    await user.click(dataButtons[0]);

    // "데이터" button should now be active
    const dataButton = dataButtons[0].closest("button")!;
    expect(dataButton.className).toMatch(/bg-black/);
    expect(dataButton.className).toMatch(/text-white/);

    // "홈" should no longer be active
    const homeButtons = screen.getAllByText("홈");
    const homeButton = homeButtons[0].closest("button")!;
    expect(homeButton.className).toMatch(/hover:bg-gray-100/);
    expect(homeButton.className).not.toMatch(/bg-black/);
  });

  it("mobile hamburger button opens drawer", async () => {
    const user = userEvent.setup();
    render(<Sidebar />);

    const hamburger = screen.getByLabelText("Open menu");
    await user.click(hamburger);

    // Drawer close button should now be visible
    expect(screen.getByLabelText("Close menu")).toBeDefined();
  });

  it("clicking close button closes the drawer", async () => {
    const user = userEvent.setup();
    render(<Sidebar />);

    // Open drawer
    await user.click(screen.getByLabelText("Open menu"));
    expect(screen.getByLabelText("Close menu")).toBeDefined();

    // Close drawer
    await user.click(screen.getByLabelText("Close menu"));
    expect(screen.queryByLabelText("Close menu")).toBeNull();
  });

  it("clicking backdrop closes the drawer", async () => {
    const user = userEvent.setup();
    render(<Sidebar />);

    // Open drawer
    await user.click(screen.getByLabelText("Open menu"));

    // The backdrop is the sibling div with bg-black/50
    const closeButton = screen.getByLabelText("Close menu");
    // The backdrop is the first child of the fixed overlay container
    const overlay = closeButton.closest(".fixed")!;
    const backdrop = overlay.querySelector(".bg-black\\/50")!;
    fireEvent.click(backdrop);

    expect(screen.queryByLabelText("Close menu")).toBeNull();
  });

  it("selecting a menu item in mobile drawer closes the drawer", async () => {
    const user = userEvent.setup();
    render(<Sidebar />);

    // Open drawer
    await user.click(screen.getByLabelText("Open menu"));

    // Click "문의하기" — in the drawer it's the second occurrence (desktop is first)
    const contactButtons = screen.getAllByText("문의하기");
    // There should be 2: one desktop, one drawer
    const drawerContactButton = contactButtons[contactButtons.length - 1];
    await user.click(drawerContactButton);

    // Drawer should close
    expect(screen.queryByLabelText("Close menu")).toBeNull();
  });

  it("renders icons for each menu item", () => {
    render(<Sidebar />);
    // react-icons render <svg> elements; each menu button should contain one
    const buttons = screen.getAllByRole("button");
    // Desktop sidebar has 3 menu buttons; check each has an svg child
    const menuButtons = buttons.filter(
      (btn) => btn.querySelector("svg") !== null
    );
    // At least 3 (desktop menu items)
    expect(menuButtons.length).toBeGreaterThanOrEqual(3);
  });

  it("rapid successive clicks settle on the last clicked item", async () => {
    const user = userEvent.setup();
    render(<Sidebar />);

    const dataButtons = screen.getAllByText("데이터");
    const contactButtons = screen.getAllByText("문의하기");
    const homeButtons = screen.getAllByText("홈");

    // Rapid clicks: 데이터 → 문의하기 → 홈
    await user.click(dataButtons[0]);
    await user.click(contactButtons[0]);
    await user.click(homeButtons[0]);

    // 홈 should be active
    const homeButton = homeButtons[0].closest("button")!;
    expect(homeButton.className).toMatch(/bg-black/);
    expect(homeButton.className).toMatch(/text-white/);

    // Others should not be active
    const dataButton = dataButtons[0].closest("button")!;
    expect(dataButton.className).not.toMatch(/bg-black/);
  });
});
