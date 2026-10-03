"use client";

import { useEffect, useState } from "react";

type ContactMessage = {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  message: string;
  status: string;
  created_at: string;
};

const statusLabels: Record<string, string> = {
  new: "Mới",
  read: "Đã xem",
  replied: "Đã xử lý",
};

export default function AdminContactPage() {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedContact, setSelectedContact] =
    useState<ContactMessage | null>(null);

  async function loadContacts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/contact", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Không thể tải dữ liệu liên hệ."
        );
      }

      setContacts(data.contacts || []);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Không thể tải dữ liệu liên hệ."
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(
    id: number,
    status: string
  ) {
    try {
      const response = await fetch("/api/contact", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Không thể cập nhật trạng thái."
        );
      }

      setContacts((current) =>
        current.map((contact) =>
          contact.id === id
            ? {
                ...contact,
                status,
              }
            : contact
        )
      );

      setSelectedContact((current) =>
        current && current.id === id
          ? {
              ...current,
              status,
            }
          : current
      );
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Không thể cập nhật trạng thái."
      );
    }
  }

  async function deleteContact(id: number) {
    const confirmed = window.confirm(
      "Anh có chắc muốn xóa yêu cầu liên hệ này không?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Không thể xóa yêu cầu liên hệ."
        );
      }

      setContacts((current) =>
        current.filter((contact) => contact.id !== id)
      );

      setSelectedContact((current) =>
        current && current.id === id ? null : current
      );
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Không thể xóa yêu cầu liên hệ."
      );
    }
  }

  useEffect(() => {
    loadContacts();
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Liên hệ</h1>
          <p>
            Quản lý các yêu cầu liên hệ được gửi từ website.
          </p>
        </div>

        <button
          type="button"
          onClick={loadContacts}
          className="admin-primary-button"
        >
          Làm mới
        </button>
      </div>

      {error && (
        <div className="admin-alert admin-alert-error">
          {error}
        </div>
      )}

      <div className="admin-contact-summary">
        <div className="admin-contact-stat">
          <span>Tổng yêu cầu</span>
          <strong>{contacts.length}</strong>
        </div>

        <div className="admin-contact-stat">
          <span>Chưa xem</span>
          <strong>
            {
              contacts.filter(
                (contact) => contact.status === "new"
              ).length
            }
          </strong>
        </div>

        <div className="admin-contact-stat">
          <span>Đã xem</span>
          <strong>
            {
              contacts.filter(
                (contact) => contact.status === "read"
              ).length
            }
          </strong>
        </div>

        <div className="admin-contact-stat">
          <span>Đã xử lý</span>
          <strong>
            {
              contacts.filter(
                (contact) => contact.status === "replied"
              ).length
            }
          </strong>
        </div>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-empty">
            Đang tải dữ liệu...
          </div>
        ) : contacts.length === 0 ? (
          <div className="admin-empty">
            Chưa có yêu cầu liên hệ nào.
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table admin-contact-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Người liên hệ</th>
                  <th>Điện thoại</th>
                  <th>Email</th>
                  <th>Nội dung</th>
                  <th>Trạng thái</th>
                  <th>Thời gian</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {contacts.map((contact, index) => (
                  <tr key={contact.id}>
                    <td>{index + 1}</td>

                    <td>
                      <strong>{contact.name}</strong>
                    </td>

                    <td>
                      {contact.phone || "—"}
                    </td>

                    <td>
                      {contact.email || "—"}
                    </td>

                    <td>
                      <div className="admin-contact-message">
                        {contact.message}
                      </div>
                    </td>

                    <td>
                      <select
                        value={contact.status}
                        onChange={(event) =>
                          updateStatus(
                            contact.id,
                            event.target.value
                          )
                        }
                        className={`admin-status-select status-${contact.status}`}
                      >
                        <option value="new">
                          Mới
                        </option>

                        <option value="read">
                          Đã xem
                        </option>

                        <option value="replied">
                          Đã xử lý
                        </option>
                      </select>
                    </td>

                    <td>
                      {new Date(
                        contact.created_at
                      ).toLocaleString("vi-VN")}
                    </td>

                    <td>
                      <div className="admin-contact-actions">
                        <button
                          type="button"
                          className="admin-small-button"
                          onClick={() =>
                            setSelectedContact(contact)
                          }
                        >
                          Xem
                        </button>

                        <button
                          type="button"
                          className="admin-small-button danger"
                          onClick={() =>
                            deleteContact(contact.id)
                          }
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedContact && (
        <div
          className="admin-modal-overlay"
          onClick={() => setSelectedContact(null)}
        >
          <div
            className="admin-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="admin-modal-header">
              <div>
                <h2>Chi tiết yêu cầu liên hệ</h2>
                <p>
                  Yêu cầu #{selectedContact.id}
                </p>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={() =>
                  setSelectedContact(null)
                }
              >
                ×
              </button>
            </div>

            <div className="admin-contact-detail">
              <div className="admin-detail-row">
                <span>Họ và tên</span>
                <strong>
                  {selectedContact.name}
                </strong>
              </div>

              <div className="admin-detail-row">
                <span>Số điện thoại</span>
                <strong>
                  {selectedContact.phone || "—"}
                </strong>
              </div>

              <div className="admin-detail-row">
                <span>Email</span>
                <strong>
                  {selectedContact.email || "—"}
                </strong>
              </div>

              <div className="admin-detail-row">
                <span>Thời gian gửi</span>
                <strong>
                  {new Date(
                    selectedContact.created_at
                  ).toLocaleString("vi-VN")}
                </strong>
              </div>

              <div className="admin-detail-row">
                <span>Trạng thái</span>

                <select
                  value={selectedContact.status}
                  onChange={(event) =>
                    updateStatus(
                      selectedContact.id,
                      event.target.value
                    )
                  }
                  className="admin-status-select"
                >
                  <option value="new">
                    Mới
                  </option>

                  <option value="read">
                    Đã xem
                  </option>

                  <option value="replied">
                    Đã xử lý
                  </option>
                </select>
              </div>

              <div className="admin-detail-message">
                <span>Nội dung cần hỗ trợ</span>

                <div>
                  {selectedContact.message}
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-secondary-button"
                onClick={() =>
                  setSelectedContact(null)
                }
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}